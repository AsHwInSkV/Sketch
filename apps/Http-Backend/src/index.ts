import express from 'express';
import { Jwt } from 'jsonwebtoken';
import { JWT_SECERT } from "@repo/backend-common/config";

const app = express();

app.post("/signup",(req,res)=>{

});

app.post("signin",(req,res)=>{

});

app.post("/room",(req,res)=>{

});

app.listen(3001);