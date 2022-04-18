const {transaction} = require('../../models')

exports.countActive = async (req,res) =>{
    try {

        const data = await transaction.findAll({
             where:{
                 userStatus: 'Active'
             }
         })
         
         const today = new Date()
         
         for(let i=0;i<data.length;i++){
            if(differenceDate(today,data[i].updatedAt) == 2){

                await transaction.update({
                    remainingActive : data[i].remainingActive - 1
                },{
                    where : {
                        id : data[i].id
                    }
                })
                if (data[i].remainingActive-1 == 0 && data[i].userStatus == 'Active'){
                    await transaction.update({
                        userStatus: 'Expired',
                    },{
                        where:{
                            id:data[i].id
                        }
                    })
                }
                
            }
             
         }
         res.send({
             status:'success'
         })
     } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'Bad Request'
        })
    }
 }

 function differenceDate(date1,date2) {
    const dateOne = new Date(date1)
    const dateTwo = new Date(date2)

    const diffTime = Math.abs(dateTwo - dateOne)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    return diffDays

}