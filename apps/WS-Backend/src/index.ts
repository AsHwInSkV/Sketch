import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECERT } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import {prismaClient} from '@repo/db/dbclient';


const ws = new WebSocketServer({port:8080});

interface User{
    userId : string,
    rooms: string[],
    ws:WebSocket
}

const users :User[] = [];

function isValidToke( token: string): string | null{
    try{
        const decoded = jwt.verify(token,JWT_SECERT);
        if(!decoded || !(decoded as JwtPayload ).userId){
            ws.close();
            return null;
        }
        if(typeof decoded == 'string'){
            return null;
        }
        return decoded.userId;
    }
    catch(e){
        return null;
    }
    
}


ws.on('connection',function connection(ws,request) {
    ws.on('error',console.error);
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = isValidToke(token)
    console.log("UserId",userId);

    if(userId ===null){
        ws.close();
        return null;
    }
    users.push({
        userId:userId,
        rooms:[],
        ws
    })
    
     ws.on('message', async function message(data){
        let Parseddata;
        console.log("Received Data",data);
        if (typeof data!=="string"){
            Parseddata = JSON.parse(data.toString());
        }
        else{
            Parseddata = JSON.parse(data);
        }
        console.log("Parsed Data",Parseddata);
        //Join-Room {type,roomId,}
        if(Parseddata.type==="Join-Rooom"){
            const user = users.find(x=>x.ws===ws);
            user?.rooms.push(Parseddata.roomId);
        }

        if(Parseddata.type==="leave-room"){
            const user =users.find(x=>x.ws===ws);
            if(!user){
                return;
            }
            user.rooms = user.rooms.filter(x=>x!==Parseddata.roomId);
        }
        
        if(Parseddata.type==="Chat"){
            const roomId = Parseddata.roomId;
            const message = Parseddata.message;
            
            await prismaClient.chat.create({
                data:{
                    roomId:Number(roomId),
                    message,
                    userId
                }
            })

            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type : "Chat",
                        message,
                        roomId,
                        userId
                    }))
                }
            })
        }
     })
});

