const db = require ('../models')
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
require('dotenv').config()

// Mi importo i miei controller per la gestione del database
const DbUser=  db.user
const Asta= db.asta
const Offerta= db.offer

//Controllo Credito Residuo
const getCredito = async (req, res) => {

    // prendo il mio wallet
    const wallet=req.user.utente.wallet
    

    //decodifico il mio wallet
    const credito=jwt.verify(wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
        return portafoglio.wallet
      });

    //Visualizzo il mio credito  
    let credito_residuo={
        Nome:req.user.utente.nome,
        Cognome:req.user.utente.cognome,
        E_mail:req.user.utente.email,
        Credito_Residuo:credito
    }
    res.status(200).send(credito_residuo)

}

//Ricarica Conto di un Utente
const InsertCredito = async (req, res) => {

    const iduser_da_ricaricare = req.params.idu
    const importo_da_ricaricare= req.body.ricarica

    // Prendo l'utente da ricaricare
    let utente_da_ricaricare =await DbUser.findOne({where: {id: iduser_da_ricaricare}})


    //Decodifico il conto
    const credito=jwt.verify(utente_da_ricaricare.wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }

        return portafoglio.wallet
      });

    //Ricarico il conto
    const wallet=credito+importo_da_ricaricare

    //Codifico di nuovo il conto dopo che l'ho ricaricato
    const new_token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_WALLET)
    
    let info ={
        wallet:new_token
    }

    //Ricarico il conto con il nuovo wallet decodificato
    let ricarica =await DbUser.update(info, {where: {id: iduser_da_ricaricare}})
    res.status(200).send(ricarica)

}

//Scalare Credito al Vincitore
const ScalaCredito = async (req, res) => {

    
    // Ottengo L'asta
    const id_asta= req.params.ida
    let data = await Asta.findOne({
        where: { id: id_asta },
    })
  
    //Ottengo L'utente da scalare in caso di vittoria
    let utente_da_scalare =await DbUser.findOne({where: {id: data.dataValues.winner}})

    //Decodifico il credito
    const credito=jwt.verify(utente_da_scalare.wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        return portafoglio.wallet
      });

    // Decremento il credito e poi successivamente ricodifico il credito
    const wallet=Number(credito.toString())-Number(data.dataValues.price_now)
  
    const new_token=jwt.sign({wallet}, process.env.ACCESS_TOKEN_WALLET)
    let info ={
        wallet:new_token
    }
    //Aggiorno il conto dell'utente
    let scala_conto =await DbUser.update(info, {where: {id: data.dataValues.winner}})
    res.status(200).send(scala_conto)

}

//Storico Aste in base all'Intervallo di tempo
const StoricoAste =  async (req, res) => {

  
  // Converto le date nel formato utile per la nostra analisi
  const dataTimeInizio=convertTZ(req.body.inizio)
  const dataTimeFine=convertTZ(req.body.fine)  
  

  /* Adesso faccio una query sulla attraverso la foreign key sulle offerta con l'id dell'asta in modo tale da avere i nostri
  dati per l'analisi */
  
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

//Spesa Effettuata in un dato intervallo di tempo
const SpesaEffettuataPeriodo = async (req,res) =>{

  //Ottengo il formato delle date utile per la nostra analisi
  const dataTimeInizio=convertTZ(req.body.inizio)
  const dataTimeFine=convertTZ(req.body.fine)  

  //Prendo le mie aste vinte nel periodo selezionato
  let data= await Asta.findAll({ where: {[Op.and]:[
    {winner:req.user.utente.id},
    {auctionTimeFinish:{[Op.gt]:dataTimeInizio}},
    {auctionTimeFinish:{[Op.lt]:dataTimeFine}},
]}})
    
    // Faccio la Somma di tutte le mie vincite
    let somma=0
    for (const indice in data) {
      somma=somma+data[indice].price_now  
    }

    //Estratto Conto delle Spese
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
    ScalaCredito,
    SpesaEffettuataPeriodo
    
}