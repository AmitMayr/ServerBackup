import GroupDataAccess from "./GroupDataAccess";
import GroupModel from "./GroupModel";
import { ObjectId } from 'mongodb';
import { uploadImageToFirebase } from '../../firebase/fileUpload';
import { BadRequestException, InternalServerException, NotFoundException, UnauthorizedException } from "../../middleware/HttpException";
import { MongoError } from "mongodb";
import UserDataAccess from "../users/UserDataAccess";
import UserGroupsDataAccess from "../usersGroups/UserGroupsDataAccess";
import UserGroupsModel from "../usersGroups/UserGroupsModel";

const groupDataAccess = new GroupDataAccess();
const userDataAccess = new UserDataAccess();
const userGroupsDataAccess = new UserGroupsDataAccess();


export async function getGroupById(id: string) {
  return groupDataAccess.FindById(id);
}

function assertUserHasGroups(user: any) {
  if (!user || !user.groups) {
    throw new NotFoundException("User not found or user has no groups.");
  }
}

export async function getGroupsUserNotConnected(userId: string, type: string) {
  const user = await userDataAccess.FindById(userId);

  assertUserHasGroups(user);

  // Create an array of ObjectIds for the user's connected groups
  const userConnectedGroupIds = user.groups.map((group: string) => new ObjectId(group));
  const query = {
    _id: { $nin: userConnectedGroupIds },
    type: type,
    deleted: false,
  };
  const groups = await groupDataAccess.FindAllGroups(query);

  return groups;
}

// all Groups With User Status
export async function allGroupsWithUserStatus(userId: string) {
  const user = await userDataAccess.FindById(userId);
  assertUserHasGroups(user);
  const userIdAsObj = new ObjectId(userId);

  const connectedGroups = await findUserGroups(userIdAsObj, 'approved');
  const pendingGroups = await findUserGroups(userIdAsObj, 'pending');
  const allGroups = await groupDataAccess.FindAllGroups();

  const connectedGroupsDetails = await getDetailedGroups(connectedGroups, connectedGroups);
  const pendingGroupsDetails = await getDetailedGroups(pendingGroups, connectedGroups);
  const notJoinGroups = await getNotJoinGroups(allGroups, connectedGroups, pendingGroups);

  const addCountOfUsers = async (group:any) => {
    group.amount_of_users = await userGroupsDataAccess.CountUsersInGroup(new ObjectId(group._id));
  };

  // Add the user count to each group
  await Promise.all(connectedGroupsDetails.map(addCountOfUsers));
  await Promise.all(pendingGroupsDetails.map(addCountOfUsers));
  await Promise.all(notJoinGroups.map(addCountOfUsers));

  return {
    approved: connectedGroupsDetails,
    pending: pendingGroupsDetails,
    not_join: notJoinGroups,
  };
}
async function findUserGroups(userIdAsObj: ObjectId, status: string): Promise<string[]> {
  const groups = await userGroupsDataAccess.FindAllUserGroups({ user_id: userIdAsObj, is_approved: status }, { group_id: 1 });
  return groups.map(group => group.group_id.toString());
}
async function getGroupDetailsWithUsersCount(groupId: string, connectedGroups: string[]) {
  const group = await groupDataAccess.FindById(groupId);
  group.amount_of_users = connectedGroups.filter(cg => cg === groupId).length;
  return group;
}
async function getDetailedGroups(groupIds: string[], connectedGroups: string[]) {
  return await Promise.all(groupIds.map(groupId => getGroupDetailsWithUsersCount(groupId, connectedGroups)));
}
async function getNotJoinGroups(allGroups: any[], connectedGroups: string[], pendingGroups: string[]) {
  return allGroups.filter(group => {
    return !connectedGroups.some(cg => cg === group._id.toString()) &&
      !pendingGroups.some(pg => pg === group._id.toString());
  });
}




export async function getConnectedGroups(userId: string) {
  const user = await userDataAccess.FindById(userId);
  assertUserHasGroups(user);
  const userConnectedGroupIds = user.groups.map((group: string) => new ObjectId(group));
  const qeury = { _id: { $in: userConnectedGroupIds } };
  const groups = await groupDataAccess.FindAllGroups(qeury);
  return groups;
}

export async function addGroupToUser(userId: string, groupId: string) {
  const user = await userDataAccess.FindById(userId);

  assertUserHasGroups(user);

  // is group ID is valid
  const groupToAdd = await groupDataAccess.FindById(groupId);
  if (!groupToAdd || groupToAdd.deleted) {
    throw new NotFoundException("Group not found or deleted.");
  }

  // group is already connected to the user
  if (user.groups.some((group: ObjectId) => group.toString() === groupId)) {
    throw new BadRequestException("Group already connected to the user.");
  }

  const query = { user_id: new ObjectId(userId), group_id: new ObjectId(groupId) };
  const userGroupReq = new UserGroupsModel(query)
  const request = await userGroupsDataAccess.FindAllUserGroups(query)
  if (request.length > 0) {
    throw new BadRequestException("You have already requested to join.");
  }
  await userGroupsDataAccess.InsertOne(userGroupReq)
  return `Your request to join ${groupToAdd.group_name} has been successfully sent.`;
}

export async function removeGroupFromUser(userId: string, groupId: string): Promise<string> {
  const user = await userDataAccess.FindById(userId);

  assertUserHasGroups(user);

  // Check if group ID is valid
  const groupToRemove = await groupDataAccess.FindById(groupId);
  if (!groupToRemove || groupToRemove.deleted) {
    throw new NotFoundException("Group not found or deleted.");
  }

  // Check if group is connected to the user
  const groupIndex = user.groups.findIndex((group: ObjectId) => group.toString() === groupId);
  if (groupIndex === -1) {
    throw new BadRequestException("Group not connected to the user.");
  }

  // Remove the group from the user's groups
  user.groups.splice(groupIndex, 1);
  await userDataAccess.UpdateUserDetails(user._id.toString(), user);

  const query = {
    user_id: new ObjectId(userId),
    group_id: new ObjectId(groupId),
  };

  const userGroupRequest = (await userGroupsDataAccess.FindAllUserGroups(query))[0];

  if (!userGroupRequest) {
    throw new NotFoundException("Request not found.");
  }
  await userGroupsDataAccess.DeleteById(userGroupRequest._id.toString());

  return `Successfully disconnected from the group ${groupToRemove.group_name}`;
}

export async function addAdminToGroup(adminId: string, new_admin_email: string, groupId: string): Promise<string> {

  const users = await userDataAccess.FindAllUsers({ email: new_admin_email }, { _id: 1, groups: 1 });

  if (users.length === 0) {
    throw new NotFoundException("User with given email not found.");
  }

  const user = users[0];
  assertUserHasGroups(user);
  const userId = user._id;

  // Check if group ID is valid
  const group = await groupDataAccess.FindById(groupId);
  if (!group || group.deleted) {
    throw new NotFoundException("Group not found or deleted.");
  }

  // Check if user is connected to the group
  const groupIndex = user.groups.findIndex((group: ObjectId) => group.toString() === groupId);
  if (groupIndex === -1) {
    throw new BadRequestException("User not connected to the Group.");
  }

  if (!group.admins_ids.map((id:ObjectId) => id.toString()).includes(adminId)) {    
    throw new UnauthorizedException("User not Unauthorized to add admin to this group")
  }

  if (group.admins_ids.map((id:ObjectId) => id.toString()).includes(userId.toString())) {    
    throw new BadRequestException("User already admin.");
  }
  group.admins_ids.push(userId);

  await groupDataAccess.UpdateGroup(groupId.toString(), group);

  return `Successfully added ${user.email} as an admin of the group ${group.group_name}.`;
}

export async function updateGroup(groupId: string, userId: string, updateData: Partial<GroupModel>) {
  // Check if a group with the same name already exists
  if (updateData.group_name) {
    const existingGroup = await groupDataAccess.FindAllGroups({ group_name: updateData.group_name });
    if (existingGroup && existingGroup[0]._id.toString() !== groupId) {
      throw new BadRequestException('A group with this name already exists');
    }
  }

  const group = await groupDataAccess.FindById(groupId);
  if (!group.admins_ids.map((id:ObjectId) => id.toString()).includes(userId)) {
    throw new UnauthorizedException("User not authorized to update the group");
  }

  // Only update allowed fields
  const dataToUpdate = {
    group_name: updateData.group_name || group.group_name,
    locations: updateData.locations || group.locations,
    active: updateData.active || group.active
  };

  return groupDataAccess.UpdateGroup(groupId, dataToUpdate);
}

export async function uploadGroupImage(id: string, file?: Express.Multer.File) {
  const filePath = `groupsimages/${id}`; 
  const image_URL = await uploadImageToFirebase(file, filePath);
  await groupDataAccess.UpdateGroup(id, { image_URL }); 
  return image_URL;
}





export async function getAllGroups() {
  return groupDataAccess.FindAllGroups({ deleted: false, type: { $ne: "GENERAL" } });
}

export async function deleteGroupById(id: string) {
  return groupDataAccess.DeleteGroupById(id);
}

export async function markGroupAsDeleted(id: string) {
  return groupDataAccess.UpdateGroup(id, { deleted: true });
}

export async function addGroup(group: GroupModel) {
  const existingGroups = await groupDataAccess.FindAllGroups({
    group_name: group.group_name
  });

  if (existingGroups.length > 0) {
    throw new BadRequestException("Group with this name already exists.");
  }

  return groupDataAccess.InsertOne(group);
}


export async function updateGroupDetails(id: string, groupDetails: GroupModel, file?: Express.Multer.File) {
  // If a file is provided, upload it and update photo_URL
  console.log(file);
  if (file) {
    try {
      const filePath = `groupsimages/${id}`;
      groupDetails.image_URL = await uploadImageToFirebase(file, filePath);
    } catch (error) {
      throw new InternalServerException("Error uploading image: " + error);
    }
  }
  try {
    const res = await groupDataAccess.UpdateGroup(id, groupDetails);
    return res
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      // This error code stands for 'Duplicate Key Error'
      const keyValue = (error as any).keyValue;
      throw new BadRequestException(`group with this ${Object.keys(keyValue)[0]} already exists.`);
    }
    throw new BadRequestException("Error updating user details: " + error);
  }
}


export async function uploadImageToFirebaseAndUpdateGroup(file: Express.Multer.File, filePath: string, groupId: string) {
  const image_URL = await uploadImageToFirebase(file, filePath);
  return groupDataAccess.UpdateGroup(groupId, { image_URL });
}
