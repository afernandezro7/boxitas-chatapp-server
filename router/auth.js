/*************************************
*            [AUTH] ROUTES           *
*           host + /api/auth        *
**************************************/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router()

// Importar Custom Middleware

// importar Controladores de mis rutas
const { crearUsuario, loginUsuario,  revalidarToken } = require('../controller/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validarJWT');





/*********************/
/*  [AUTH] ENDPOINTS */
/*********************/

// Crear Usuarios
router.post(
    '/new',
    [   
        //Route Middleswares
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ] 
    ,crearUsuario
)

// Login
router.post(
    '/login',
    [   
        //Route Middleswares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ]
    ,loginUsuario
)

// Revalidar token
router.get(
    '/renew', 
    [
        //Route Middleswares
        validarJWT
    ]
    ,revalidarToken
)




module.exports = router

