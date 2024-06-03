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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '../.env' });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const server = (0, express_1.default)();
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
server.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
server.use(cookieParser());
const httpServer = http_1.default.createServer(server);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }, pingTimeout: 60000
});
io.engine.on("connection_error", (err) => {
    console.log("server");
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
    console.log("server-end");
});
server.use(cors());
server.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate("session"));
server.use(cors());
server.use(cookieParser());
server.use(express_1.default.json());
//  ---------passport-----------
passport.use("local", new LocalStrategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hlo");
        const user = yield prisma.users.findUnique({
            where: { email },
        });
        console.log(user);
        if (!user)
            return done(null, false, { message: "invalid credentials" });
        crypto.pbkdf2(password, Buffer.from(user.salt, "base64"), 310000, 32, "sha256", function (err, hashedPassword) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!crypto.timingSafeEqual(Buffer.from(user.password, "base64"), hashedPassword)) {
                    return done(null, false, { message: "invalid credentials" });
                }
                const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                done(null, { id: user.id, role: user.role, username: user.username, userImage: user.userImage, coverImage: user.coverImage, token }); // this lines sends to serializer
            });
        });
    }
    catch (err) {
        return done({ message: "Something Went Wrong" });
    }
})));
passport.use("jwt", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY,
}, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.users.findUnique({
            where: { id: jwt_payload.id },
        });
        if (user) {
            done(null, sanitizeUser(user));
        }
        else {
            done(null, false);
        }
    }
    catch (err) {
        console.log(err);
        return done(err, false);
    }
})));
passport.serializeUser(function (user, done) {
    console.log("serialize", user);
    process.nextTick(function () {
        return done(null, user);
    });
});
passport.deserializeUser(function (user, done) {
    console.log("deserialize", user);
    process.nextTick(function () {
        return done(null, user);
    });
});
//  ------- websocket Socket.IO event listeners
io.on("connection", (socket) => {
    console.log("A user connected");
    console.log("id", socket.id);
    // handle chat message event
    socket.on('joinRoom', (room) => {
        socket.join(room);
    });
    socket.on("chatMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const {room,content}=data;
            const { room, content, senderId, receiverId } = data;
            // // Save the message to the database using Prisma
            const message = yield prisma.message.create({
                data: {
                    content,
                    senderId,
                    receiverId
                }
            });
            console.log("hi", message);
            // // send the chat message to reciever id
            io.to(room).emit('receiveMessage', { content: content, senderId: senderId, receiverId: receiverId });
            console.log(data);
        }
        catch (error) {
            console.error("Error saving message:", error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/posts", isAuth(), postRouter.router);
server.get("*", (req, res) => res.sendFile(path_1.default.join(__dirname, "../../frontend/build", "index.html")));
httpServer.listen(process.env.PORT, () => {
    console.log("server started running at:" + process.env.PORT);
});
//# sourceMappingURL=index.js.map