const jwt = require('jsonwebtoken')


exports.authAdmin = async (req,res,next) =>{
    const authHeader = req.header("Authorization")
    
    const token = authHeader && authHeader.split(' ')[1]
    const dataToken = parseJwt(token)

    if(dataToken.role != 'admin'){
        return res.status(401).send({
            message:'Access is Denied'
        })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = verified
        next()
    } catch (error) {
        
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
