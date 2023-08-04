import Express  from "express";
import fs from 'fs'
import __dirname from "../utils.js";
const router = Express.Router()
router.get("/",(req,res)=> {
    res.render("index",{})
})
router.get("/message",(req,res)=> {
    res.render("message",{})
})
router.get("/message/chat",(req,res)=> {
    const chats = JSON.parse(fs.readFileSync(__dirname +"/public/data/chats.json","utf8"))
    const chat = chats.find(i=> i.chatID == req.query.chatId)
    console.log(chat)
    res.render("chat",chat.chatID)
})

export default router
