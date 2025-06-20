import express from 'express';
import  jwt  from 'jsonwebtoken';
import { JWT_SECERT } from "@repo/backend-common/config";
import { AuthMiddleware } from './AuthMiddleware';
import { CreateUserSchema, SignInUserSchema, CreateRoomSchema } from '@repo/common/types';

const app = express();

app.post("/signup",(req,res)=>{
    const data = CreateUserSchema.safeParse(req.body)
    res.json({
        userId: 1
    })

});

app.post("signin",(req,res)=>{
    const data = SignInUserSchema.safeParse(req.body);
    const userId = 1;
    const token = jwt.sign({userId}, JWT_SECERT);
    res.json({token});
});

app.post("/room",AuthMiddleware,(req,res)=>{
    const data = CreateRoomSchema.safeParse(req.body);
    //@ts-ignore
    const userId = req.userId;
    res.json({
        roomId: 1
    })
});

app.listen(3001);