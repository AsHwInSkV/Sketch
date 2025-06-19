import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECERT } from "@repo/backend-common/config";

const ws = new WebSocketServer({port:8080});

ws.on('connection',function connection(ws,req) {



    
    ws.on('error',console.error);
});

