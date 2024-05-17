//Modules
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const PORT = 8000 
import dotenv from 'dotenv'
const app = express()

dotenv.config()

//MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))

//Connect to mongoDB
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:') )
db.once('open', () => console.log('Connected to DB'))


//Define the Schema and Model for form data
const contactSchema = new mongoose.Schema({
    name: String,
    people: Number,
    date: Date,
    message: String
})
//collection to write to
const Contact = mongoose.model("Contact", contactSchema)
//Routes

//Handle form Submission request
app.post('/submit', async(req, res) => {
    const formData = {
        name: req.body.Name,
        people: req.body.People,
        date: new Date(req.body.date),
        message:  req.body.Message
    }

    try{
    //save the form data to the contact collection
    const newContactForm = new Contact(formData)
    await newContactForm.save()
    res.redirect('/?success')
    } catch(error){
        res.redirect('/?error')
    }
})

app.get('./', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')

})

//Start Server
app.listen(PORT,() => console.log(`Server is running on port ${PORT}`))

