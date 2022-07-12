const express =require ('express')
const cors = require ('cors')
const app =express ()

var corOptions= {
    origin: 'http://localhost:7098'
}


//Mildware
app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))


//router

const router= require('./routes/gestoreRoutes.js')
app.use('/api/aste', router)

//Immagini Percorso
app.use('/Images',express.static('./Images'))


//testing api

app.get('/', (req, res) => {
    res.json({message: 'Hello Donato'})
})

//porta su dove comunica che  può essere diversa da quella della porta del server di MySql in quanto
// scriviamo le query in Json

const PORT = process.env.PORT || 8080

//server

app.listen(PORT, ()=>  {
    console.log('Server sta runnando sulla porta'+ PORT)
})