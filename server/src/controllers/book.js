const {Book,userListBook} = require('../../models')
const month = [
    'January',
    'February',
    'March',
    'April',
    'Mei',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Desember'
  ]

  //use File system
const fs = require('fs')
const {promisify} = require('util')

const deleteFile = promisify(fs.unlink)

exports.AddBook = async (req,res) =>{
    
    try {
        const bookName = req.files[0].filename
        const bookCover = req.files[1].filename
        const data = {
            title: req.body.title,
            publicationDate: req.body.publicationDate,
            pages: req.body.pages,
            author: req.body.author,
            isbn: req.body.isbn,
            about: req.body.about,
            bookFile: bookName,
            bookCover: bookCover
        }
        const newBook = await Book.create(data)
        const {id,title,publicationDate,pages,author,isbn,about} = newBook
        res.send({
            status:'success',
            data : {
                book: {
                    id,
                    title,
                    publicationDate: getFullTime(publicationDate),
                    pages,
                    author,
                    isbn,
                    about,
                    bookFile: req.files[0].filename,
                    bookCover:req.files[1].filename
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

exports.getBooks = async (req,res) =>{
    
    try {
        const {search, date} = req.body
        const books = await Book.findAll({
            attributes:{
                exclude:['createdAt','updatedAt']
            }
        })

       

        const data = books.map((book)=>{
            return {
                id : book.id,
                title : book.title,
                publicationDate: getFullTime(book.publicationDate),
                pages : book.pages,
                author: book.author,
                isbn: book.isbn,
                about: book.about,
                bookFile: book.bookFile,
                bookCover: book.bookCover
            }
        })

        const results = books.filter((data)=>{
            let dataSearch = new RegExp(search,'i')
            let dataDate = new RegExp(date,'g')
            let searchId = data.id.toString()
            let searchTitle = data.title
            let searchAuthor = data.author
            let searchISBN = data.isbn
            let searchDate = data.publicationDate

            return (searchId.match(dataSearch) || searchTitle.match(dataSearch) || searchAuthor.match(dataSearch) || searchISBN.match(dataSearch)) && searchDate.match(dataDate)
        })
        res.send({
            status:'success',
            data:{
                results
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

exports.getBook = async (req,res) =>{
    try {

        const {id} = req.params

        const book = await Book.findOne({
            where:{
                id
            },
            attributes:{
                exclude:['createdAt','updatedAt']
            }
        })
        const bookDate = getFullTime(book.publicationDate)
        res.send({
            status:'success',
            data:{
                id : book.id,
                title : book.title,
                publicationDate: bookDate,
                fullDatePublication:book.publicationDate,
                pages : book.pages,
                author: book.author,
                isbn: book.isbn,
                about: book.about,
                bookFile: book.bookFile,
                bookCover:book.bookCover
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

exports.updateBook = async (req,res) =>{
    try {
        
        const {id} = req.params
        const getBook = await Book.findOne({
            where:{
                id
            }
        })
        console.log(req.body)
        const book = await Book.update(req.body,{
            where:{
                id
            }
        })
        const dataBook = await Book.findOne({
            where:{
                id
            }
            ,
            attributes:{
                exclude:['createdAt','updatedAt']
            }
        })

        if (req.body.bookFile){
            deleteFile(`uploads/${getBook.bookFile}`)
        }
        if(req.body.bookCover){
            deleteFile(`uploads/${getBook.bookCover}`)
        }

        res.send({
            status:'success',
            data:{
                book: book
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

exports.deleteBook = async (req,res) =>{
    try {

        const {id} = req.params

        const getBook = await Book.findOne({
            where:{
                id
            }
        })

        await userListBook.destroy({
            where:{
                bookId: id
            }
        })

        await Book.destroy({
            where:{
                id
            }
        })

        deleteFile(`uploads/${getBook.bookFile}`)

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

function getFullTime(time){
    const date = new Date(time)
    const getmonth = month[date.getMonth()]

    let year = date.getFullYear()
    

    return `${getmonth} ${year}`
}
