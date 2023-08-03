import express from 'express'
import viewRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import fs from 'fs'
import __dirname from './utils.js'
import {Server} from 'socket.io'
const app = express()
const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.engine("handlebars",handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine","handlebars")
app.use(express.static(__dirname+"/public"))
app.use("/",viewRouter)
const httpServer = app.listen(PORT,()=> {
    console.log("Server running")
})
const socketServer = new Server(httpServer)
let messages = []
socketServer.on("connection",socket=> {
    socket.on("userConnected",data=> {
        const dataUser = JSON.parse(fs.readFileSync(__dirname +"/public/data/users.json","utf8"))
        const userSelected = dataUser.findIndex(i=> i.userId == data.user)
        if (userSelected == -1) {

        } else {
            const chats = JSON.parse(fs.readFileSync(__dirname +"/public/data/chats.json","utf8"))
            const chatsAllowed = []
            for (let i = 0; i<chats.length;i++) {
                for(let h = 0;h<chats[i].chatUsers.length;h++) {
                    if (chats[i].chatUsers[h] == dataUser[userSelected].userId) {
                        chatsAllowed.push(chats[i])
                    }
                }
            }
            const chatsWhat = []
            for (let i = 0;i<chatsAllowed.length;i++) {
                const thisChat = {}
                const name = chatsAllowed[i].chatUsers.find(i => {
                    if (i !== data.user) {
                        return i
                    }
                })
                thisChat.name = dataUser[name].name
                thisChat.img = dataUser[name].img
                thisChat.messages = chatsAllowed[i].messages
                thisChat.chatUsers = chatsAllowed[i].chatUsers
                thisChat.chatID = chatsAllowed[i].chatID
                chatsWhat.push(thisChat)
                
            }
            socket.emit("chats",chatsWhat)
        }
    })
    socket.on("chat",data=>{
        const chats = JSON.parse(fs.readFileSync(__dirname +"/public/data/chats.json","utf8"))
        const chatId = chats.findIndex(i=> i.chatID == data)
        if (chatId == -1) {

        } else {
            socket.emit("chat",chats[chatId])
        }
    })
    socket.on("message",data=>{
        messages.push(data)

        socketServer.emit("messageLogs",messages)
    })
    //Desconectar chat
    socket.on("closeChat",data=> {
        if(data.close === "close") {
            socket.disconnect()
        }
    })  
})