const db = require ('../models')
const { Op, where } = require("sequelize");
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()

//Creao il Main del Controller
const Asta= db.asta
const User= db.user
const Offerta= db.offer

//Creazione Asta
const addAsta=  async (req, res)=> {
    console.log('AGGIUNGO ASTACAZZOOO--->'+Object.keys(req.user.utente))
    console.log("SONO DENTRO ADDASTA---->"+req.user.utente.id)
    let info = {
        title: req.body.title,
        type: req.body.type,
        price_open: req.body.price_open,
        description: req.body.description,
        auctionTimeStart: req.body.auctionTimeStart,
        auctionTimeFinish: req.body.auctionTimeFinish,
        price_now: req.body.price_open,
        state: req.body.state,
        UserID: req.user.utente.id
        
    }
    console.log('VEDIAMO LE INFOOOO'+info.title)
    const asta = await Asta.create(info)
    res.status(200).send(asta)
    //console.log(asta)
}

//Ottenere Tutte Le Aste
const getTutteAsta = async (req, res) => {
    let asta =await Asta.findAll({})
    res.status(200).send(asta)
}

//Ottenere una sola Asta
const getAsta = async (req, res) => {
    console.log("SONO DENTRO GETASTA")
    let tipo = req.params.type
    let asta =await Asta.findOne({where: {type: tipo}})
    res.status(200).send(asta)
}

//Ottenere asta in base allo stato Asta
const getStateAsta = async (req, res) => {
    let asta =await Asta.findAll({where: {[Op.or]:[
        {state:'non aperta'},
        {state:'in esecuzione'},
        {state:'terminata'} 
    ]}})
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

// Relazione Uno a  Molti

const getApertaAstaOfferta =  async (req, res) => {

    const stato='in esecuzione'
    console.log("MIO STATOOOO---->"+stato)

    const data = await Asta.findAll({
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        where: {state:stato}
        
    })
    console.log(data)
    res.status(200).send(data)

}

const addProposta= async (req, res)=> {
    const id_asta=req.params.ida
    
    let info={
        nuova_proposta:req.body.nuova_proposta
    }
    const proposta = await Asta.update(info, {where: {id: id_asta}})
    res.status(200).send(proposta)
}


const prova =  async (req, res) => {

    const tipo_asta= req.params.tipo
    const data = await Asta.findAll({
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        where: {type:tipo_asta}
        
    })
    console.log(data)
    res.status(200).send(data)
}

module.exports = {
    addAsta,
    getAsta,
    getAstaPubblicata,
    getTutteAsta,
    updateAsta,
    deleteAsta,
    getAstaOfferta,
    getStateAsta,
    getApertaAstaOfferta,
    addProposta,
    prova
}