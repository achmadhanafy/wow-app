const express = require('express')
const router = express.Router()

//Controller
const {addUser,getUsers,deleteUser} = require('../controllers/user')
const {AddBook,getBooks,getBook,updateBook, deleteBook} = require('../controllers/book')
const {login} = require('../controllers/login')
const {getProfile, editProfile} = require('../controllers/profile')
const { addToList } = require('../controllers/userListBook')
const { countActive } = require('../controllers/countActive')
const { logout } = require('../controllers/logout')
const {addTransaction, editTransaction, getTransaction, getTransactions} = require('../controllers/transaction')

//Middlewares
const {auth} = require('../middlewares/auth')
const {uploadFile, uploadFileBook} = require('../middlewares/uploadFile')
const { authAdmin } = require('../middlewares/authAdmin')
const { iatCheck } = require('../middlewares/iatCheck')

//Route
router.post('/register',addUser)
router.post('/login',login)
router.delete('/logout/:id',logout)
router.get('/users',getUsers)
router.delete('/user/:id',deleteUser)
router.post('/books',authAdmin,iatCheck,uploadFileBook('bookFile'),AddBook)
router.get('/books',getBooks)
router.get('/book/:id',getBook)
router.post('/countActive',countActive)
router.patch('/book/:id',authAdmin,iatCheck,updateBook)
router.delete('/book/:id',authAdmin,iatCheck,deleteBook)
router.post('/transaction',auth,iatCheck,uploadFile('transferProof'),addTransaction)
router.patch('/transaction/:id',authAdmin,iatCheck,editTransaction)
router.get('/transaction/:id',getTransaction)
router.get('/transactions',authAdmin,iatCheck,getTransactions)
router.get('/profile',auth,iatCheck,getProfile)
router.patch('/profile',auth,iatCheck,uploadFile('image'),editProfile)
router.post('/addtolist',auth,iatCheck,addToList)

module.exports = router