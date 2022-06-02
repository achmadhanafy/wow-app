const {userListBook,profile,Book} = require('../../models')
const { decodeJWT } = require('./webservice')

exports.addToList = async (req,res) =>{
    try {
        const dataToken = decodeJWT(req,res)

        const profileId = await profile.findOne({
            where:{
                userId : dataToken.id
            }
        })

        req.body.profileId = profileId.id

        const data = req.body

        const checkBook = await userListBook.findOne({
            where:{
                bookId: data.bookId
            }
        })

        if(checkBook){
            return res.status(200).send({
                status:'failed',
                message:'Book already added'
            })
        }


        const newListBook = await userListBook.create(data)

        res.status(200).send({
            status:'success',
            data: {
                newListBook: {
                    profileId: newListBook.profileId,
                    bookId: newListBook.bookId
                }
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

exports.deleteList = async(req,res) =>{
    try {
        
        const dataToken = decodeJWT(req,res)
        const {bookId} = req.body
        const getProfile = await profile.findOne({
            where:{
                userId: dataToken.id
            }
        })

        const deleteList = await userListBook.destroy({
            where:{
                profileId: getProfile.id,
                bookId
            }
        })

        res.status(200).send({
            status:'success',
            data: deleteList,
            message:'Delete user list book success'
        })

        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.getList = async(req,res) => {
    try {
        const dataToken = decodeJWT(req,res)

        const getProfile = await profile.findOne({
            where:{
                userId: dataToken.id
            }
        })
        const getList = await userListBook.findAll({
            where: {
                profileId: getProfile.id
            }
        })
        
        const getBook = await Promise.all(getList.map(async(data)=>{
            const get = await Book.findOne({
                where:{
                    id: data.bookId
                }
            })
            return get
        }))
        console.log(getBook)
        res.status(200).send({
            status:'success',
            data: getBook
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}
