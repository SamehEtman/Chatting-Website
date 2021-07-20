const generateMessage = (username ,text) =>{
    return {
        username ,
        message : text ,
        createdAt : new Date().getTime()
    }
}

const generateLocation = (username , msg) =>{
    return {
        username ,
        url : msg,
        createdAt : new Date().getTime()
    }
}

module.exports ={
    generateMessage,
    generateLocation
}