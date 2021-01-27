const User = require('../models/usuario')
const Message = require('../models/message')

const userConnection = async(uid, online)=>{
    const user =  await User.findById(uid)
    user.online = online
    await user.save()
    return user
}

const getUsers = async()=>{

    try {
        const users = await User
            .find()//{ _id: {$ne: uid}}
            .sort('-online')
        ;

        return  users

    } catch (error) {

        console.log(error);
        return []
    }
}

const saveMessage = async (msg)=>{
    try {
        const message = new Message(msg)
        await message.save()
        
        return message
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    userConnection,
    getUsers,
    saveMessage
}