import { PrismaClient } from '@prisma/client'
import { Request, Response } from "express";
const prisma = new PrismaClient()
const crypto = require('crypto');
const { sanitizeUser } = require('../common/common');
const jwt = require('jsonwebtoken');

exports.createUser = async (req:Request, res:Response) => {
  const { username, email, password,userImage,interests } = req.body
  console.log(req.body);
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err:Error, hashedPassword:String) {
        const binaryData = Buffer.from(hashedPassword, 'binary'); // Example binary data
        const base64String = binaryData.toString('base64');
        const user = await prisma.users.create({
          data: {
            ...req.body,
            password: base64String,
            salt:salt.toString("base64"),
          },
        });
        console.log(hashedPassword);
        req.login(sanitizeUser(user), (err:Error) => {
          if (err){ 
            throw err;
          }else{
            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:user.id, role:user.role,username:user.username,userImage:user.userImage,coverImage:user.coverImage});
          }
          })
      }
    );
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// exports.loginUser = async (req:Request, res:Response) => {
//   const user=req.user;
  
//   res.cookie('jwt',user.token, {
//     expires: new Date(Date.now() + 3600000),
//     httpOnly: true,
//   })
//   .status(200)
//   .json({id:user.id, role:user.role});
// }

exports.loginUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(req.user);
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const typedUser = user as { id?: string; role?: string; token?: string,username?: string,userImage?: string|null,coverImage?: string|null };
    if (!typedUser.id || !typedUser.role || !typedUser.token || !typedUser.username) {
      return res.status(401).json({ message: 'Invalid user data' });
    }
    const { id, role, token,username,userImage,coverImage } = typedUser;
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res.status(200).json({ id, role,username,userImage,coverImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.logoutUser = (req:Request, res:Response) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: 'Logged out successfully' });
}

exports.checkAuth = (req:Request, res:Response) => {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }
}