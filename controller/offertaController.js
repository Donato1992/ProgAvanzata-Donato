const db = require('../models')
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()

const Offerta = db.offer
const User= db.user

//Aggiungi Offerta

const addOfferta = async (req, res) => {

    //console.log("SONO Vedi User----->>>"+Object.keys(req.user.utente))
    const iduser = req.user.utente.id
    const wallet=req.user.utente.wallet
    const idasta = req.params.ida


    let data = {
        UserID: iduser,
        AstaID: idasta,
        price: req.body.price,
    }
    if (wallet>=data.price)
    {
        console.log("Mio Wallet-->"+wallet)
        const offerta = await Offerta.create(data)
        res.status(200).send(offerta)
    }
    else
    {
        console.log("Mio Wallet-->"+wallet)
        res.status(403).send("Credito Insufficiente")   
    }

}


//Aggiungi Offerta Token

const addOffertaToken = async (req, res) => {

    //console.log("SONO Vedi User----->>>"+Object.keys(req.user.utente))
    const iduser = req.user.utente.id
    const wallet=req.user.utente.wallet
    const idasta = req.params.ida

    const token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '240s' })
    console.log('Mio Token'+token)
    


    let data = {
        UserID: iduser,
        AstaID: idasta,
        price: req.body.price,
    }
    if (wallet>=data.price)
    {
        console.log("Mio Wallet-->"+wallet)
        const offerta = await Offerta.create(data)
        res.status(200).send(offerta)
    }
    else
    {
        console.log("Mio Wallet-->"+wallet)
        res.status(403).send("Credito Insufficiente")   
    }

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