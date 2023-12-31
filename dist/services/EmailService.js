"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = require("../config/environment");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'trempboss777@gmail.com',
                pass: environment_1.EMAIL_PASS,
            },
        });
    }
    sendVerificationEmail(to, token) {
        const verificationLink = `http://your-app.com/verify?token=${token}`;
        const mailOptions = {
            from: 'trempboss777@gmail.com',
            to: to,
            subject: 'Verify Your Email',
            text: `Please click on the link to verify your email: ${verificationLink}`,
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            }
            else {
                console.log('Email sent:', info);
            }
        });
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map