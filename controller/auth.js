/*************************************
*          [AUTH] CONTROLLERS        *
**************************************/

const { response } = require('express');
const bcrypt = require('bcryptjs');

// Load DB Models
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');





/*
    [AUTH] register Controller
*/
const crearUsuario = async(req, res = response)=>{  
      
    try {
        
        const { nombre, email, password } = req.body
        const existeEmail = await Usuario.findOne({ email }) 

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario registrado este email'
            })
        }

        const usuario = new Usuario( req.body )
        
        // Encriptar password
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync( password, salt )


        // Guardar usuario en BD
        await usuario.save()

        // Generar JWT
        const token = await generarJWT(usuario._id)

        res.json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error'
        })
    }

      
}


/*
    [AUTH] login Controller
*/
const loginUsuario = async(req, res = response)=>{

     const { email, password } = req.body
    
    try {
        
        const usuarioDB = await Usuario.findOne({ email }) 

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            })
        }

        // Hacer match de contarseña para loguear
        const isValidPassword = bcrypt.compareSync( password, usuarioDB.password)
        
        if( !isValidPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'La pareja de usuario y password no coinciden'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB._id)

        res.json({
            ok: true,
            msg: 'usuario autenticado correctamente',
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error'
        })
    }

}


/*
    [AUTH] renew Controller
*/
const revalidarToken = async(req, res = response)=>{

    const uid = req.uid

    try {
        
        const usuarioDB = await Usuario.findById( uid )
    
        // Generar JWT
        const token = await generarJWT(usuarioDB._id)
    
        res.json({
            ok: true,
            msg: 'Token renovado con éxito',
            usuario: usuarioDB,
            token
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
    crearUsuario,
    loginUsuario,
    revalidarToken
}
