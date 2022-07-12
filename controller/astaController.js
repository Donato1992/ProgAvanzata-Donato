const db = require ('../models')

//caricamento immagini
const multer=require('multer')
const path =require('path')

//Creao il Main del Controller
const Asta= db.asta
const User= db.user
const Pagamenti= db.pagamenti
const Offerta= db.offer

//Creazione Asta
const addAsta=  async (req, res)=> {
    let info = {
        image: req.file.path,
        title: req.body.title,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        published: req.body.published ? req.body.published:false,
        BidTime: req.body.BidTime,
        UserID: req.body.UserID
    }

    console.log("SIAMO QUI"+info.image)
    const asta = await Asta.create(info)
    res.status(200).send(asta)
    console.log(asta)
}

//Ottenere Tutte Le Aste
const getTutteAsta = async (req, res) => {
    let asta =await Asta.findAll({})
    res.status(200).send(asta)
}

//Ottenere una sola Asta
const getAsta = async (req, res) => {
    let tipo = req.params.type
    let asta =await Asta.findOne({where: {type: tipo}})
    res.status(200).send(asta)
}

//Update Asta
const updateAsta = async (req, res) => {
    let id = req.params.id
    let asta =await Asta.update(req.body, {where: {id: id}})
    res.status(200).send(asta)
}

//Cancella Un Asta tramite id
const deleteAsta = async (req, res) => {
    let id = req.params.id
    await Asta.destroy({where: {id:id}})
    res.status(200).send('Asta Cancellata')
}


//Ottenere la Pubblicazione
const getAstaPubblicata = async (req, res) => {
    let asta =await Asta.findAll({where: {published: true}})
    res.status(200).send(asta)

}

// Relazione Uno a  Molti

const getAstaOfferta =  async (req, res) => {

    const id = req.params.id

    const data = await Asta.findAll({
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        where: { id: id }
    })
    console.log(data)
    res.status(200).send(data)

}

//Caricamento di un Immagine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))
        console.log("ADESSO VEDI"+mimeType)

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Solo Immagini Supportate')
    }
}).single('image')

module.exports = {
    addAsta,
    getAsta,
    getAstaPubblicata,
    getTutteAsta,
    updateAsta,
    deleteAsta,
    getAstaOfferta,
    upload
}