//import Model
const {user,profile,userListBook,userislogin} = require('../../models')

//import package
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getUsers = async(req,res)=>{
    try {
      
        const users = await user.findAll({
            attributes:{
                exclude:["password","role","createdAt","updatedAt"]
            }
        })
        
        res.send({
            status:'success',
            data:{
                users: users
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}



exports.addUser = async(req,res) =>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required(),
        fullName: Joi.string().required(),
        role:Joi.string()
    })

    const {error} =  schema.validate(req.body)

    if (error){
        console.log(error);
        return res.send({
            status:"Bad Request",
            message: error.details[0].message,
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const getEmail = await user.findOne({
            where:{
                email:req.body.email
            }
        })
        if(getEmail){
            return res.send({
                status:'failed',
                message:'Email has used'
            })
        } else {
            
            const newUser = await user.create({
                email: req.body.email,
                password : hashedPassword,
                fullName: req.body.fullName,
                role: 'user',
                userStatus: 'Not Active'
            })

            await profile.create({
                userId: newUser.id,
                phone: "",
                gender: "Male",
                address: "",
                image: 'Default-image.png',
            })
    
            const dataToken = {
                id: newUser.id,
                role: newUser.role
            }
    
            const SECRET_KEY = process.env.TOKEN_KEY
            const token = jwt.sign(dataToken, SECRET_KEY)
            const tokenParse = parseJwt(token)
            
            return res.status(200).send({
                status:'success',
                data: {
                    user: {
                        email: newUser.email,
                        token
                    },
                }
            })
        }
        

    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.deleteUser = async (req,res) =>{
    try {
        
        const{id} = req.params

        const getProfileId = await profile.findOne({
            where:{
                userId : id
            }
        })

        await userListBook.destroy({
            where:{
                profileId: getProfileId.id
            }
        })

        await profile.destroy({
            where:{
                userId: id
            }
        })

        const userHasDelete = await user.destroy({
            where:{
                id
            }
        })



        res.send({
            status:'success',
            data: {
                    id
            }
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
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