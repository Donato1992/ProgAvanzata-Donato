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
        console.log("Mio Wallet-->"+wallet+data.UserID)
        const offerta = await Offerta.create(data)
        res.status(200).send(offerta)
    }
    else
    {
        console.log("Mio Wallet-->"+data.price)
        res.status(403).send("Credito Insufficiente")   
    }

}


//Aggiungi Offerta Token

const addOffertaToken = async (req, res) => {

    //console.log("SONO Vedi User----->>>"+Object.keys(req.user.utente))
    const iduser = req.user.utente.id
    console.log("UTENTE CHE AGGIUNGE L'ASTA--->"+iduser)
    const wallet=req.user.utente.wallet
    const idasta = req.params.ida

    const credito=jwt.verify(wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        // Qui Setto l'utente che ho codificato
        //req.user = portafoglio;
        console.log("DECRIPTO PORTAFOGLIO--->"+portafoglio.wallet)
        return portafoglio.wallet
      });
    

    
      console.log("DECRIPTO PORTAFOGLIO DUEEEE--->"+credito)
    let data = {
        UserID: iduser,
        AstaID: idasta,
        price: req.body.price,
    }
    if (credito>=data.price)
    {
        console.log("Mio Wallet-->"+wallet+data.UserID)
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
    getAllOfferta,
    addOffertaToken
}