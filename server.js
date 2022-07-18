const express =require ('express')
const cors = require ('cors')
const app =express ()

var corOptions= {
    origin: 'http://localhost:7098'
}


//Middleware
app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))


//router

const router= require('./routes/gestoreRoutes.js')
app.use('/api/aste', router)


//Testing delle Api

app.get('/', (req, res) => {
    res.json({message: 'Hello Donato'})
})

//Porta dove comunica dove comunica il nostro server
//Inoltre le query saranno in Json e poi codificate in Mysql

const PORT = process.env.PORT || 8080

//Server

app.listen(PORT, ()=>  {
    console.log('Server sta runnando sulla porta'+ PORT)
})