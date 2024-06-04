require('dotenv').config({ path: '../.env' });
import http from "http";
import express, { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { Server as SocketIOServer } from "socket.io";
import path from "path";
const prisma = new PrismaClient()
const server = express();
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");

const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const { isAuth, sanitizeUser, cookieExtractor } = require("./common/common");

server.use(express.static(path.join(__dirname, "../../frontend/build")));
server.use(cookieParser())
const httpServer = http.createServer(server);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}, pingTimeout: 60000
});


io.engine.on("connection_error", (err) => {
  console.log("server")
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
  console.log("server-end")
});
server.use(cors());



server.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false, 
    })
  );
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate("session"));
server.use(cors());
server.use(cookieParser());
server.use(express.json());

//  ---------passport-----------
passport.use(
  "local",
  new LocalStrategy({usernameField:"email"},async (email:any, password:any, done:any) => {
    try {
      console.log("hlo")
      const user = await prisma.users.findUnique({
        where: { email },
      });
      console.log(user)
      console.log("hi")
      if (!user) return done(null, false,{ message: "invalid credentials" });

      crypto.pbkdf2(
          password,
          Buffer.from(user.salt,"base64"),
          310000,
          32,
          "sha256",
          async function (err:any, hashedPassword:any) {

            if (!crypto.timingSafeEqual(Buffer.from(user.password,"base64"), hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(
              sanitizeUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role,username:user.username,userImage:user.userImage,coverImage:user.coverImage, token }); // this lines sends to serializer
          }
        );
      } catch (err) {
        return done({ message: "Something Went Wrong" })
      }
    })
);        

passport.use(
"jwt",
new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY,
  },
  async (jwt_payload:any, done:any) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: jwt_payload.id },
      }); 
      if (user) {
        done(null, sanitizeUser(user));
      } else {
        done(null, false);
      }
    } catch (err) {
      console.log(err)
      return done(err, false);
    }
  }
)
);

passport.serializeUser(function (user:any, done:any) {
console.log("serialize", user);
process.nextTick(function () {
  return done(null,  user);
});
});

passport.deserializeUser(function (user:any, done:any) {
console.log("deserialize", user);
process.nextTick(function () {
  return done(null, user);
});
});

//  ------- websocket Socket.IO event listeners


io.on("connection", (socket: any) => {
  console.log("A user connected");
  console.log("id",socket.id)
  // handle chat message event
  socket.on('joinRoom', (room:any) => {
    socket.join(room);
  });
  socket.on("chatMessage", async (data: any) => {
    try {
      // const {room,content}=data;
      const { room, content, senderId, receiverId } = data;
      
      // // Save the message to the database using Prisma
      const message = await prisma.message.create({
          data: {
              content,
              senderId,
              receiverId
          }
      });
      console.log("hi",message)
      // // send the chat message to reciever id
      io.to(room).emit('receiveMessage', {content:content,senderId:senderId,receiverId:receiverId});
      console.log(data)
  } catch (error) {
      console.error("Error saving message:", error);
  }
  });

  socket.on("disconnect", () => {
      console.log("A user disconnected");
  });
});




server.use("/users",isAuth(),userRouter.router);
server.use("/auth",authRouter.router)
server.use("/posts",isAuth(),postRouter.router)
server.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"))
);

 

httpServer.listen(process.env.PORT, () => {
    console.log("server started running at:"+process.env.PORT);
});

