import express from 'express'
import viewRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io'
const app = express()
const PORT = 9090
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
    socket.on("message",data=>{
        messages.push(data)

        socketServer.emit("messageLogs",messages)
    })
    socket.on("userConnected",data=> {
        socket.broadcast.emit("userConnected",{data:data,msg:messages})
    })
    //Desconectar chat
    socket.on("closeChat",data=> {
        if(data.close === "close") {
            socket.disconnect()
        }
    })  
})