const users = [];

//Join users to chat online
function userJoin(id,username,room){

    //declaring a user
    const user = {id, username , room};

    //adding to online users
    users.push(user);


    return user;
}

//Get the current user by id
function getCurrentUser(id){
    return users.find( user => user.id === id);
}

//User leaves the chat
function userLeave(id){
    const index = users.findIndex( user => user.id === id );

    //-1 means that not in the list 
    //index !== -1 means it is persent
    if(index !== -1){
        return users.splice(index , 1)[0];
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

//export to server.js
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};