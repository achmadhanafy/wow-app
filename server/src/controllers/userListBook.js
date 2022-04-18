const {userListBook,profile} = require('../../models')

exports.addToList = async (req,res) =>{
    try {

        const authHeader = req.header("Authorization")
    
        const token = authHeader && authHeader.split(' ')[1]
        const dataToken = parseJwt(token)

        const profileId = await profile.findOne({
            where:{
                userId : dataToken.id
            }
        })

        req.body.profileId = profileId.id

        const data = req.body

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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};