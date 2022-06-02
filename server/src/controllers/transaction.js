const {transaction,user} = require('../../models')


const currentDate = new Date()

exports.addTransaction = async (req,res) =>{
    const authHeader = req.header("Authorization")
    
    const token = authHeader && authHeader.split(' ')[1]
    const dataToken = parseJwt(token)
    try {
        if(!req.file){
            return res.send({
                message:'Please upload transfer proof'
            })
        }

        const data = {
            userId: dataToken.id,
            transferProof:req.file.filename,
            remainingActive:0,
            userStatus:'Not Active',
            paymentStatus:'Pending'
        }

       
        const newTransaction = await transaction.create(data)
        await user.update({
            userStatus:'Pending'
        },{
            where:{
                id:dataToken.id
            }
        })

        const detailTransaction = await transaction.findOne({
            where:{
                id:newTransaction.id
            },
            include:[
                {
                    model: user,
                    as:'users',
                    attributes:{
                        exclude:['createdAt','updatedAt','email','password','role']
                    },
                }
            ],
            attributes:{
                exclude:['createdAt','updatedAt','userId']
            }
        })

        res.status(200).send({
            status:'success',
            data: {
                transaction:detailTransaction
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

exports.editTransaction = async (req,res)=>{
    const authHeader = req.header("Authorization")
    
    const token = authHeader && authHeader.split(' ')[1]
    const dataToken = parseJwt(token)
    try {
        let data = {}
        if (req.body.paymentStatus == 'Approved'){
            await user.update({
                userStatus: 'Active'
            },{
                where:{
                    id: dataToken.id
                }
            })
            data = {
                remainingActive:'30',
                userStatus:'Active',
                paymentStatus:req.body.paymentStatus
            }
        } else {
            data = {
                remainingActive:'0',
                userStatus:'Not Active',
                paymentStatus:req.body.paymentStatus
            }
        }
        
        const {id} = req.params
        const newTransaction = await transaction.update(data,{
            where:{
                id
            }
        })

        const detailTransaction = await transaction.findOne({
            where:{
                id
            },
            include:[
                {
                    model: user,
                    as:'users',
                    attributes:{
                        exclude:['createdAt','updatedAt','email','password','role']
                    },
                }
            ],
            attributes:{
                exclude:['createdAt','updatedAt','userId']
            }
        })
        if (req.body.paymentStatus == 'Approved'){
            await user.update({
                userStatus: 'Active'
            },{
                where:{
                    id: detailTransaction.users.id
                }
            })
        } else {
            await user.update({
                userStatus: 'Not Active'
            },{
                where:{
                    id: detailTransaction.users.id
                }
            })
        }

        res.status(200).send({
            status:'success',
            data: {
                transaction:detailTransaction
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

exports.getTransaction = async (req,res) =>{
    try {

        const {id} = req.params

        const detailTransaction = await transaction.findOne({
            where:{
                id
            },
            include:[
                {
                    model: user,
                    as:'users',
                    attributes:{
                        exclude:['createdAt','updatedAt','email','password','role']
                    },
                }
            ],
            attributes:{
                exclude:['createdAt','updatedAt','userId']
            }
        })

        res.status(200).send({
            status:'success',
            data : {
                transaction: detailTransaction
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

exports.getTransactions = async (req,res) => {
    try {

        const {search,userStatus,paymentStatus} = req.body

        const allTransaction = await transaction.findAll({
            include:[
                {
                    model: user,
                    as:'users',
                    attributes:{
                        exclude:['createdAt','updatedAt','email','password','role']
                    },
                }
            ],
            attributes:{
                exclude:['createdAt','updatedAt','userId']
            }
        })

        const results = allTransaction.filter((data)=>{
            let dataSearch = new RegExp(search,'i')
            let dataStatusUser = userStatus
            let dataStatusPayment = new RegExp(paymentStatus,'g')
            let searchId = data.id.toString()
            let searchName = data.users.fullName
            let searchStatusUser = data.users.userStatus
            let searchStatusPayment = data.paymentStatus

            return (searchId.match(dataSearch) || searchName.match(dataSearch)) && dataStatusUser === "" ? searchStatusUser.match(dataStatusUser) : searchStatusUser === dataStatusUser  && searchStatusPayment.match(dataStatusPayment)
        })
        
        

        res.status(200).send({
            status:'success',
            data: {
                transaction: results
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


function differenceDate(date1,date2) {
    const dateOne = new Date(date1)
    const dateTwo = new Date(date2)

    const diffTime = Math.abs(dateTwo - dateOne)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    return diffDays

}

function remaining(activeDate,updatedAt) {
    const remainingActive = activeDate - differenceDate(updatedAt,currentDate) + 1 
    
    if (remainingActive <= 0){
        
        return 0
    } else {
        return remainingActive
    }
    

}

function getActive(activeDate,updatedAt,currentActive){
    if (remaining(activeDate,updatedAt) == 0){
        return 'Expired'
    } else {
        return currentActive
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