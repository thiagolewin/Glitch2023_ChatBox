const socket = io()
let user;
const chats = document.getElementById("chats")
function entrarAlChat(chatId) {
    const body = document.querySelector("body")
    body.removeChild(chats)
    socket.emit("chat",chatId)
}
Swal.fire({
    icon: "info",
    title: "Identificate",
    input: "text",
    text:"Ingrese el userName para identificarse en el chat",
    inputValidator: (value)=> {
        if(!value) {
            return "Necestias escribir tu Id"
        } else {
            socket.emit("userConnected",{user:user})
        }
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
    socket.emit("userConnected",{user:user})
})
socket.on("chats",data=> {
    const chatsFragment = document.createDocumentFragment()
    for (let i = 0; i<data.length;i++) {
        const chat = document.createElement("div")
        chat.classList.add("chat")
        chat.innerHTML = `<img src="${data[i].img}">
        <h2>${data[i].name}</h2>`
        chatsFragment.appendChild(chat)
        chat.addEventListener("click", function(){
            entrarAlChat(data[i].chatID)
        })
    }
    chats.appendChild(chatsFragment)
})
socket.on("chat",data=> {
    console.log(data)
})