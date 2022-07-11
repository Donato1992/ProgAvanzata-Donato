const db = require ('../models')

//caricamento immagini
const multer=require('multer')
const path =require('path')

//Creao il Main del Controller
const Product=  db.products
const Review= db.reviews

//Creazione Prodotti
const addProduct=  async (req, res)=> {
    let info = {
        image: req.file.path,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        published: req.body.published ? req.body.published:false
    }

    const product = await Product.create(info)
    res.status(200).send(product)
    console.log(product)
}

//Ottenere Tutti i Prodotti
const getAllProduct = async (req, res) => {
    let products =await Product.findAll({})
    res.status(200).send(products)
}

//Ottenere Un solo Prodotto
const getOneProduct = async (req, res) => {
    let id = req.params.id
    let product =await Product.findOne({where: {id: id}})
    res.status(200).send(product)
}

//Update Prodotti
const updateProduct = async (req, res) => {
    let id = req.params.id
    let product =await Product.update(req.body, {where: {id: id}})
    res.status(200).send(product)
}

//Delete Prodotto tramite id
const deleteProduct = async (req, res) => {
    let id = req.params.id
    await Product.destroy({where: {id:id}})
    res.status(200).send('Prodotto Cancellato')
}


//Ottenere la Pubblicazione
const getPublishedProduct = async (req, res) => {
    let products =await Product.findAll({where: {published: true}})
    res.status(200).send(products)

}

// 7. connect one to many relation Product and Reviews

const getProductReviews =  async (req, res) => {

    const id = req.params.id

    const data = await Product.findOne({
        include: [{
            model: Review,
            as: 'review'
        }],
        where: { id: id }
    })

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
    addProduct,
    getAllProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getPublishedProduct,
    getProductReviews,
    upload
}