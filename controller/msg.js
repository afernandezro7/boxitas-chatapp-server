/*************************************
*          [MSG] CONTROLLERS        *
**************************************/

const { response } = require('express');

// Load DB Models
const Message = require('../models/message');


/*
    [MSG] register Controller
*/
const getUserChat = async(req, res = response)=>{

    const userID = req.uid;
    const msgfrom = req.params.from;

    try {
        const last30Msg = await Message.find({
            $or: [
                {from: userID , for: msgfrom},
                {from: msgfrom , for: userID },
            ]
        })
        .sort( { createdAt: 'asc'  } )
        // // .limit(30) 
        // .sort( { createdAt: 'desc'  } )
        // .limit(30)
        // .sort( { createdAt: 'asc' }  )      

        res.json({
            ok: true,
            msg: 'Messages List',
            messages: last30Msg
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error'
        })
    }

}

module.exports = {
    getUserChat,

}
