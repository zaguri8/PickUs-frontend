
import { useEffect, useState } from 'react'
import socketIO, { Socket } from 'socket.io-client'
import { useUser } from '../../../../logic/context/Firebase'


const toJson = (o: any) => JSON.stringify(o)
const fromJson = (s: string) => JSON.parse(s)

export default () => {

    const [socket, setSocket] = useState<Socket>(socketIO('http://localhost:5051/', { transports: ['websocket'] }))
    const [connected, setConnected] = useState<boolean>(false)
    const { user } = useUser()

    const connect = () => {
        socket.on('connect', () => {
            setConnected(true)
        })
        socket.on('disconnect', () => {
            setConnected(false)
        })
        setSocket(socket)
    }

    const disconnect = () => socket.disconnect()
    const sendMessage = (message: string) => {
        socket.emit('message', toJson({ m: message, u: user }))
    }

    const receiveMessage = (callback: (message: string) => void) => {
        socket?.on('message', (message: string) => {
            if (message) {
                try {
                    const { u, m } = fromJson(message)
                    console.log(m)
                    if (u.uid !== user!.uid)
                        callback(m)
                    else
                        callback('Message sent')
                } catch (e) {
                    console.log(e)
                    callback(message)
                }
            }
        })
    }

    useEffect(() => {
        if (socket.connected || !user) return
        connect();
        return () => { disconnect() }
    }, [user])

    useEffect(() => { user && receiveMessage(alert) }, [socket])
    return {
        socket,
        connect,
        disconnect,
        connected,
        sendMessage,
    } as const
}