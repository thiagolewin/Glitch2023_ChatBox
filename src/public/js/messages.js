const socket = io()
let user;
const chatBox = document.getElementById("chatBox")
Swal.fire({
    icon: "info",
    title: "Identificate",
    input: "text",
    text:"Ingrese el userName para identificarse en el chat",
    inputValidator: (value)=> {
        if(!value) {
            return "Necestias escribir tu Nombre"
        } else {
            socket.emit("userConnected",{user:user})
        }
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
    const userName = document.getElementById("myName")
    userName.innerHTML = user
    socket.emit("userConnected",{user:user})
})

chatBox.addEventListener("keyup",(evt)=>{
    if(evt.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message",{user: user, msg: chatBox.value})
            chatBox.value = ""
        }
    }
})

socket.on("messageLogs",data=> {
    const messageLog = document.getElementById("messageLogs")
    let logs =""
    data.forEach(log => {
        logs += `${log.user}: ${log.msg}<br/>`
    });
    messageLog.innerHTML = logs
})
socket.on("userConnected",data=> {
    let message = `Nuevo usuario conectado: ${data.data.user}`
    Swal.fire({
        icon:"info",
        title:"Nuevo usuario entra al chat",
        text: message,
        toast: true
    })
    const messageLog = document.getElementById("messageLogs")
    let logs =""
    data.msg.forEach(log => {
        logs += `${log.user}: ${log.msg}<br/>`
    });
    messageLog.innerHTML = logs
})
const closeChatBox = document.getElementById("closeChatBox")
closeChatBox.addEventListener("click",evt=> {
    const messageLog = document.getElementById("messageLogs")
    socket.emit("closeChat",{close:"close"})
    messageLog.innerHTML = ""
})