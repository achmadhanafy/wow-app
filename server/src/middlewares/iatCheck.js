const {userislogin} = require('../../models')

exports.iatCheck = async (req,res,next) =>{

    const authHeader = req.header("Authorization")
    
    const token = authHeader && authHeader.split(' ')[1]
    const dataToken = parseJwt(token)

    
    try {

        const iat = await userislogin.findOne({
            where:{
                iat:dataToken.iat
            }
        })
        console.log(token);
        if (dataToken.iat != iat.iat){
            return res.status(401).send({
                message:'Access is Denied'
            })
        }

        next()

        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Bad Request'
        })
    }

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};