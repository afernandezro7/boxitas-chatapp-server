/*************************************
*            [MSG] ROUTES            *
*           host + /api/msg          *
**************************************/


const { Router } = require('express');
const { check } = require('express-validator');
const router = Router()


// Import Custom Middleware
const { validarJWT } = require('../middlewares/validarJWT');

// import Routes controllers
const { getUserChat } = require('../controller/msg');




/*********************/
/*  [MSG] ENDPOINTS  */
/*********************/

//  User List of message
router.get('/:from', validarJWT, getUserChat)









module.exports = router