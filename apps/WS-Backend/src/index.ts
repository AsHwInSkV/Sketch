import { WebSocketServer } from "ws";
import { JWT_SECERT } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import {prismaClient} from '@repo/db/dbclient';


const ws = new WebSocketServer({port:8080});

ws.on('connection',function connection(ws,request) {
    ws.on('error',console.error);
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const decoded = jwt.verify(token,JWT_SECERT);
    if(!decoded || !(decoded as JwtPayload ).userId){
        ws.close();
        return;
    }
    

     ws.on('message',function message(data){
        ws.send('pong')
     })
});

