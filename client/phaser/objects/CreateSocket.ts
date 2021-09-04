import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'

export default function createSocket(namespace: string, spectate: string, friend: string) {

    console.log(os.hostname())
    let socket = io("http://" + os.hostname() + ":3000/" + namespace, {
        extraHeaders: {
            "Authorization": config.userToken,
            "user_id": config.userId
        },
        transportOptions: {
            cors : {
                origin: '*'
            },
        },
        query: { "spectate": spectate, "friend": friend },
    })

    return socket
}
