import express from 'express';
import  jwt  from 'jsonwebtoken';
import { JWT_SECERT } from "@repo/backend-common/config";
import { AuthMiddleware } from './AuthMiddleware';
import { CreateUserSchema, SignInUserSchema, CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/dbclient';

const app = express();

app.use(express.json());

app.post("/signup",async (req,res)=>{
    const Parseddata = CreateUserSchema.safeParse(req.body);
    if(!Parseddata.success){
        res.json({
            message:"Invalid data"
        });
        return;
    }
    try{
        const dbdata= await prismaClient.user.create({
        data : {
            name: Parseddata.data?.name,
            email:Parseddata.data?.email,
            password:Parseddata.data?.password
        }
    });
    res.json({
        userId: dbdata.id
    })
    }
    catch(e){
        res.status(411).json({
            message:"User already exits"
        })
    }
    
});

app.post("/signin",async (req,res)=>{
    const data = SignInUserSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Invalid Data"
        });
        return;
    }
    try{
            const user =await prismaClient.user.findUnique({
        where :{
            email: data.data?.email,
            password: data.data?.password
        }
    })
    //@ts-ignore
    const userId = user.id;
    const token = jwt.sign({userId}, JWT_SECERT);
    res.json({token});
    }
    catch(e){
        res.status(404).json({
            message:"User not found"
        });
    }
    
});

app.post("/room",AuthMiddleware,async(req,res)=>{
    const Parseddata = CreateRoomSchema.safeParse(req.body);
    if(!Parseddata.success){
        res.json({
            message:"Invalid Data"
        });
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    const room =await prismaClient.room.create({
        data:{
            //@ts-ignore
            slug:Parseddata.data.name,
            adminId: userId
        }
    })
    res.json({
        roomId: room.id
    })
});

app.listen(process.env.port||3001);