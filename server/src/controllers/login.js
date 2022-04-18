//import Model
const {user,userislogin} = require('../../models')

//import package
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async(req,res) =>{ 
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required()
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.send({
            error: {
              message: error.details[0].message,
            },
          });
    }
    try {

       const userIs = await user.findOne({
           where:{
               email:req.body.email
           },
           attributes:{
               exclude:['createdAt','updatedAt'],
           }
       })

       if (userIs == null){
           return res.send({
              error:{
                  message:"Email Not found"
              }
           })
       }

       const userValid = await bcrypt.compare(req.body.password,userIs.password)

       if (!userValid){
        return res.status(400).send({
            status: "failed",
            message: "Email or Password Doesnt Match",
          });
       }
       const dataToken = {
        id: userIs.id,
        role: userIs.role,
        }

        

        const SECRET_KEY = process.env.TOKEN_KEY
        const token = jwt.sign(dataToken, SECRET_KEY)
        const tokenParse = parseJwt(token)

            const isLogin = await userislogin.create({
                iat: tokenParse.iat,
                userId: userIs.id
            })
        
        return res.status(200).send({
            status:'success',
            data: {
                user: {
                    email: userIs.email,
                    token
                },
                isLoginId: isLogin.id
            }
        })
        
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

