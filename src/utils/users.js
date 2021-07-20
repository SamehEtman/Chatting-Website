let users = []

const addUser = ({id , username , room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    if (!username || !room)
        return {error : "username and room are required"}

    const isFound = users.find((user) =>{
        return user.username === username && user.room == room;
    })
    if (isFound){
        return {
            error: "Username is already in use"
        }
    }
    const user = {
        id , username , room
    }
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    
    const index = users.findIndex((user)=>{
        return user.id === id;
    })
    if (index === -1)
        return {error : "user not found"};
    const user = users.splice(index , 1);
    return user[0]
}

const getUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id;
    })
    return users[index];
}
const getUsersInRoom = (room)=>{
    const usersInRoom = users.filter((user)=>{
        return user.room === room;
    })
    return usersInRoom;
}
const user = {
    id :5 , username :'sdaf' ,room : 'asdfsaf'
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}