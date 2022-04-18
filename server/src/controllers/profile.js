const {profile,Book,user,userListBook} = require('../../models')
const fs = require('fs')
const {promisify} = require('util')
const deleteFile = promisify(fs.unlink)

exports.getProfile = async (req,res) =>{

    try {

        const authHeader = req.header("Authorization")
    
        const token = authHeader && authHeader.split(' ')[1]
        const dataToken = parseJwt(token)

        const detailProfile = await profile.findOne({
            where:{
                userId : dataToken.id
            },
            include:[
                {
                    model:user,
                    as:'users',
                    attributes:{
                        exclude:['password','createdAt','updatedAt']
                    }
                },
                {
                    model:Book,
                    as: 'userListBooks',
                    through: {
                        model: userListBook,
                        as:'bridge',
                        attributes:[]
                    },
                    attributes:{
                        exclude:['publicationDate','pages','isbn','about','createdAt','updatedAt']
                    }
                }
            ],
            attributes:{
                exclude:['userId','createdAt','updatedAt']
            }
        })
        
        res.status(200).send({
            status:'success',
            data: {
                profile: detailProfile,
                isLoginId: dataToken.id
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

exports.editProfile = async (req,res) =>{
    try {

        const authHeader = req.header("Authorization")
    
        const token = authHeader && authHeader.split(' ')[1]
        const dataToken = parseJwt(token)
        let data = req.body 

        if (req.file){
            data.image = req.file.filename
        }

        const getProfileBefore = await profile.findOne({
            where:{
                userId : dataToken.id
            }
        })

        console.log(getProfileBefore.image);

        if(getProfileBefore.image != 'Default-image.png'){
            if (req.file){
                deleteFile(`uploads/${getProfileBefore.image}`)
            }
        }
        
        
        
        await profile.update(data,{
            where:{
                userId: dataToken.id
            }
        })

        const getProfile = await profile.findOne({
            where:{
                userId : dataToken.id
            },
            include:[
                {
                    model:user,
                    as:'users',
                    attributes:{
                        exclude:['password','createdAt','updatedAt']
                    }
                },
                {
                    model:Book,
                    as: 'userListBooks',
                    through: {
                        model: userListBook,
                        as:'bridge',
                        attributes:[]
                    },
                    attributes:{
                        exclude:['publicationDate','pages','isbn','about','createdAt','updatedAt']
                    }
                }
            ],
            attributes:{
                exclude:['userId','createdAt','updatedAt']
            }
        })
        
        
        res.status(200).send({
            status:'success',
            message:'Your profile have updated',
            data : getProfile
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