const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next)=>{

    
    try {
        const token = req.header('x-token')
        
        // validar que en el request venga el token
        if( !token){
            return res.status(401).json({
                ok:false,
                msg: 'No hay token en la petición'
            })
        }
        
        // validar que  el token sea correcto      
        const payloadJWT = jwt.verify( token, process.env.JWT_KEY )
        
        
        // imponerle al body un info del usuario para que el controller lo renueve
        req.uid = payloadJWT.uid

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Tóken no válido'
        })
    }

    next()
}

module.exports= {
    validarJWT
}