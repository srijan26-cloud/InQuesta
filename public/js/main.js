const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName =  document.getElementById('room-name');
const usersName =  document.getElementById('users');
//Get username and room from url
const {username , room } = Qs.parse(location.search , {
    ignoreQueryPrefix : true
});
console.log(username, room);

//this io() is from server.js 
//this line below automatically eaecutes when chat.js is opened
//this executes the io.on() in server.js 
const socket = io();

//SEND username and room to server.js
socket.emit('joinRoom' , {username , room});

//GET users and room from the server.js
socket.on('roomUsers' , ({room ,users}) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

//this is called due to 
//1 - io.on(  server.emit('message','Welcome..') );
//2-  io.on(  server.broadcast.emit('message','A user connected..') );
//3- io.on(  server.on('disconnect',() => { io.emit('message' , 'A user left ')}) );
// all from server.js
//on getting the message from SERVER it displays
socket.on('message' , formatmessageobj => {
    //console.log(message);
    outputMessage(formatmessageobj);

    //Scroll down on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit and SENDING to server.js
chatForm.addEventListener('submit' , (e) => {
    e.preventDefault();

    //GET message text value
    const msg = e.target.elements.msg.value;
    //console.log(msg);

    //SEND it to server.js 
    socket.emit('chatMessage', msg);

    //empty the text box after sending
    e.target.elements.msg.value = "";
});

//Render to dom
function outputMessage(formatmessageobj) {

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${formatmessageobj.username} <span> ${formatmessageobj.time}</span></p>
    <p class="text">
        ${formatmessageobj.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//ADD room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//ADD users name to DOM
function outputRoomUsers(users){
    usersName.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}