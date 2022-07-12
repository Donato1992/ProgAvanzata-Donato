const db = require('../models')

const Offerta = db.offer

//Aggiungi Offerta

const addOfferta = async (req, res) => {

    const iduser = req.params.idu
    const idasta = req.params.ida


    let data = {
        UserID: iduser,
        AstaID: idasta,
        price: req.body.price,
    }

    const offerta = await Offerta.create(data)
    res.status(200).send(offerta)

}

// Ottengo tutte le Offerte

const getAllOfferta = async (req, res) => {

    const idasta = req.params.ida

    const offerta = await Offerta.findAll({
        where:{AstaID:idasta}
    })
    res.status(200).send(offerta)

}

module.exports = {
    addOfferta,
    getAllOfferta
}