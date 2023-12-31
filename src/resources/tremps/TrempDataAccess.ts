// src/resources/tremps/TrempDataAccess.ts
import db from '../../utils/db';
import TrempModel from './TrempModel';
import { UserInTrempUpdateQuery } from './TrempInterfaces';

class TrempDataAccess {
  static collection = 'Tremps';


  async insertTremp(tremp: TrempModel) {
    return await db.Insert(TrempDataAccess.collection, tremp);
  }

  async FindTrempsByFilters(query = {}) {
    const projection = {
      _id: 1,
      creator_id:1,
      group_id: 1,
      tremp_type: 1,
      tremp_time: 1,
      from_route: 1,
      to_route: 1,
      note: 1,
      seats_amount: 1,
      users_in_tremp:1,
    };
    return await db.FindAll(TrempDataAccess.collection, query, projection,{ tremp_time: 1 });
  }

  async FindAll(query = {}, projection = {},sort = { tremp_time: 1 }) {
    return await db.FindAll(TrempDataAccess.collection, query, projection,sort);
  }

  async addUserToTremp(tremp_id: string, query: UserInTrempUpdateQuery) {
    return await db.UpdateWithOperation(TrempDataAccess.collection, tremp_id, query);
  }

  async FindByID(id: string) {
    return await db.FindByID(TrempDataAccess.collection, id);
  }

  async Update(id: string, updateQuery: any) {
    return await db.Update(TrempDataAccess.collection, id, updateQuery);
  }

}

export default TrempDataAccess;
