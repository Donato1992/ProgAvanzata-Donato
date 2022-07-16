const db = require ('../models')
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const { Op } = require("sequelize");
require('dotenv').config()

//Creao il Main del Controller
const DbUser=  db.user
const Asta= db.asta
const Pagamenti= db.pagamenti
const Offerta= db.offer

//Controllo Credito Residuo
const getCredito = async (req, res) => {

    const iduser = req.user.utente.id
    const wallet=req.user.utente.wallet
    

    const credito=jwt.verify(wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        // Qui Setto l'utente che ho codificato
        //req.user = portafoglio;
        console.log("DECRIPTO PORTAFOGLIO--->"+portafoglio.wallet)
        return portafoglio.wallet
      });
    let credito_residuo={
        Nome:req.user.utente.nome,
        Cognome:req.user.utente.cognome,
        E_mail:req.user.utente.email,
        Credito_Residuo:credito
    }
    res.status(200).send(credito_residuo)

}

//Ricarica Conto
const InsertCredito = async (req, res) => {

    const iduser_da_ricaricare = req.params.idu
    const importo_da_ricaricare= req.body.ricarica

    console.log("INSERTCREDITO--->"+iduser_da_ricaricare+importo_da_ricaricare)

    let utente_da_ricaricare =await DbUser.findOne({where: {id: iduser_da_ricaricare}})


    const credito=jwt.verify(utente_da_ricaricare.wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        // Qui Setto l'utente che ho codificato
        //req.user = portafoglio;
        console.log("DECRIPTO PORTAFOGLIO--->"+portafoglio.wallet)
        return portafoglio.wallet
      });
    const wallet=credito+importo_da_ricaricare
    const new_token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_WALLET)
    console.log("VEDIAMO IL WALLET NUOVOOOO------>>>>>>>>>"+new_token)
    let info ={
        wallet:new_token
    }
    let ricarica =await DbUser.update(info, {where: {id: iduser_da_ricaricare}})
    res.status(200).send(ricarica)

}

//Scalare Credito al Vincitore
const ScalaCredito = async (req, res) => {

    //const iduser_da_scalare = req.params.idu
    //const importo_da_scalare= req.body.ricarica
    
    const id_asta= req.params.ida
    let data = await Asta.findOne({
        where: { id: id_asta },
    })
  
    console.log("MIa Data-->"+data.dataValues.winner)
    console.log("MIa Data-->"+data.dataValues.price_now)
    

    //console.log("INSERTCREDITO--->"+iduser_da_scalare+importo_da_scalare)

    let utente_da_scalare =await DbUser.findOne({where: {id: data.dataValues.winner}})

    console.log("Utente da scalare---->"+utente_da_scalare.wallet)


    const credito=jwt.verify(utente_da_scalare.wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        // Qui Setto l'utente che ho codificato
        //req.user = portafoglio;
        console.log("DECRIPTO PORTAFOGLIO--->"+portafoglio.wallet)
        return portafoglio.wallet
      });
    const wallet=Number(credito.toString())-Number(data.dataValues.price_now)
    console.log("Nuovo Credito--->"+wallet)
    const new_token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_WALLET)
    let info ={
        wallet:new_token
    }
    let scala_conto =await DbUser.update(info, {where: {id: data.dataValues.winner}})
    res.status(200).send(scala_conto)

}


const StoricoAste =  async (req, res) => {

  
  console.log("DATA INIZIO--->"+req.body.inizio)
  const dataTimeInizio=convertTZ(req.body.inizio)
  const dataTimeFine=convertTZ(req.body.fine)  
  

  const data = await Offerta.findAll({
    include: [{
      model: Asta,
      as: 'Auction'
  }], where: {[Op.and]:[
    //{UserID:req.user.utente.nome,},
    {UserID:req.user.utente.id},
    //RICORDATI CHE CON POSTMAN L'OROLOGIO E' INDIETRO DI DUE ORE QUINDI AL CREATEDAT DEVI AGGIUNGERE DUE ORE
    {auctionTimeFinish:{[Op.gt]:dataTimeInizio}},
    {auctionTimeFinish:{[Op.lt]:dataTimeFine}},
]}
      
      
  })
  console.log(data)
  res.status(200).send(data)

}



const prova2 =  async (req, res) => {

  const id_asta= req.params.ida
  const data = await Offerta.findAll({
      include: [{
          model: Asta,
          as: 'Auction'
      }],
      where: { AstaID: id_asta },
      order: [['price', 'ASC']],
      raw:true
  })

  console.log("MIa Data-->"+Object.keys(data[0]))

  res.status(200).send(data)

}

const SpesaEffettuataPeriodo = async (req,res) =>{


  const dataTimeInizio=convertTZ(req.body.inizio)
  const dataTimeFine=convertTZ(req.body.fine)  

  let data= await Asta.findAll({ where: {[Op.and]:[
    //{winner:req.user.utente.id},
    {winner:3},
    //RICORDATI CHE CON POSTMAN L'OROLOGIO E' INDIETRO DI DUE ORE QUINDI AL CREATEDAT DEVI AGGIUNGERE DUE ORE
    {auctionTimeFinish:{[Op.gt]:dataTimeInizio}},
    {auctionTimeFinish:{[Op.lt]:dataTimeFine}},
]}})
    
    let lunghezza= Object.keys(data).length
    console.log("Lunghezza DB--->"+lunghezza)
    console.log("Spese-->"+data[0].price_now)
    let somma=0
    for (const indice in data) {
      somma=somma+data[indice].price_now  
      console.log(`${data[indice].price_now} is at position ${indice} con la simma di ${somma}`)
    }
    console.log("LA MIA SOMMA FINALE E'--->"+somma)
    let resoconto_spese= {
        Nome:req.user.utente.nome,
        Cognome:req.user.utente.cognome,
        E_mail:req.user.utente.email,
        Periodo_inizio:dataTimeInizio,
        Periodo_fine:dataTimeFine,
        Somma_Spesa:somma

    }
    console.log(resoconto_spese)
    res.status(200).send(resoconto_spese)

}


const prova =  async (req, res) => {

  const id_asta= req.params.ida
  let data = await Asta.findOne({
      where: { id: id_asta },
  })

  console.log("MIa Data-->"+data.dataValues.winner)

  



  res.status(200).send(data)

}

// Funzione per modificare la data che invio in quanto la time zone del Server è Diversa
function convertTZ(date) {
  console.log("VEDIAMO LA DATA---->"+date)
  let dataPart=date.split(/[- :]/)
  dataPart[3]=Number(dataPart[3])+2
  console.log("PARTI-->"+dataPart[0]+dataPart[1]+dataPart[2]+dataPart[3]+dataPart[4]+dataPart[5])
  const new_date=dataPart[0]+"-"+dataPart[1]+"-"+dataPart[2]+" "+dataPart[3]+":"+dataPart[4]+":"+dataPart[5]
  return new_date
}


module.exports = {
    getCredito,
    InsertCredito,
    StoricoAste,
    prova,
    ScalaCredito,
    SpesaEffettuataPeriodo
    
}