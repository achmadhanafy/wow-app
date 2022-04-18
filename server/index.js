const express = require('express')
const router = require('./src/routes')
const app = express()
const port = 5000
const CronJob = require('cron').CronJob
require('dotenv').config()
const cors = require('cors')

   

// const job = new CronJob('59 59 23 * * *',()=>{
//     remainingUpdate()
//     console.log('Every30seconds');
// })

app.use(express.json())
app.use(cors())

app.use('/api/v1/',router)
app.use('/uploads', express.static('uploads'))

app.listen(port, ()=>console.log(`App listen on port ${port}`))