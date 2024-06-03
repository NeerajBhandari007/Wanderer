"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crypto = require('crypto');
const { sanitizeUser } = require('../common/common');
const jwt = require('jsonwebtoken');
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, userImage, interests } = req.body;
    console.log(req.body);
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const binaryData = Buffer.from(hashedPassword, 'binary'); // Example binary data
                    const base64String = binaryData.toString('base64');
                    const user = yield prisma.users.create({
                        data: Object.assign(Object.assign({}, req.body), { password: base64String, salt: salt.toString("base64") }),
                    });
                    console.log(hashedPassword);
                    req.login(sanitizeUser(user), (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                            res
                                .cookie('jwt', token, {
                                expires: new Date(Date.now() + 3600000),
                                httpOnly: true,
                            })
                                .status(201)
                                .json({ id: user.id, role: user.role, username: user.username, userImage: user.userImage, coverImage: user.coverImage });
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    // Check if the error is related to unique constraint violation
                    if (error.code === 'P2002') {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    else {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                }
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// exports.loginUser = async (req:Request, res:Response) => {
//   const user=req.user;
//   res.cookie('jwt',user.token, {
//     expires: new Date(Date.now() + 3600000),
//     httpOnly: true,
//   })
//   .status(200)
//   .json({id:user.id, role:user.role});
// }
exports.loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log(req.user);
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const typedUser = user;
        if (!typedUser.id || !typedUser.role || !typedUser.token || !typedUser.username) {
            return res.status(401).json({ message: 'Invalid user data' });
        }
        const { id, role, token, username, userImage, coverImage } = typedUser;
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        });
        res.status(200).json({ id, role, username, userImage, coverImage });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.logoutUser = (req, res) => {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logged out successfully' });
};
exports.checkAuth = (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.sendStatus(401);
    }
};
//# sourceMappingURL=Auth.js.map