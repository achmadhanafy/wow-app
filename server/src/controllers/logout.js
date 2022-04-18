const {userislogin} = require('../../models')

exports.logout = async (req,res) =>{
    try {

        const {id} = req.params
        await userislogin.destroy({
            where:{
                id
            }
        })

        res.status(200).send({
            message:'Logout success'
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Bad Request'
        })
    }
}