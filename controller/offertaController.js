const db = require('../models')
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const axios = require('axios').default;
require('dotenv').config()


// Mi importo i miei controller per la gestione del database

const Offerta = db.offer
const Asta= db.asta

//Aggiungi Offerta con gestione del Token per il portafoglio
const addOffertaToken = async (req, res) => {

    let tipo_di_asta=["asta inglese","asta olandese","asta busta chiusa up","asta busta chiusa 2up"]
    
    const iduser = req.user.utente.id
    const wallet=req.user.utente.wallet
    const idasta = req.params.ida
    
    //Ottengo il Tipo di Asta alla quale voglio fare l'offerta
    const tipo = await Asta.findOne({
        where:{id:idasta}
    })
    
    //Verifico prima se l'asta posso farla cioè se è in esecuzione oppure no
    let return_info_stato=statoAsta(tipo.state)
    
    /* Vado a determinare se la tipologia di asta alla quale voglio fare l'offerta accetta oppure
       no la mia offerta in modo tale da poter determinare le corrette regole del gioco */

    let return_tipo_asta=tipologiaAsta(tipo_di_asta.indexOf(tipo.type),tipo.price_now,req.body.price)

    //Decodifico il Mio portafoglio
    const credito=jwt.verify(wallet, process.env.ACCESS_TOKEN_WALLET, (err, portafoglio) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
        return portafoglio.wallet
      });
    
    // Controllo se posso accettare l'offerta anche in base al credito residuo
    let data = {
        UserID: iduser,
        AstaID: idasta,
        price: req.body.price,
    }
    if (return_info_stato.flag&&return_tipo_asta.flag)
    {
        if (credito>=data.price)
        {
            /*Offerta accettata e quindi aggiorno la mia offerta e il mio prezzo_now. Quest'ultimo è anche
              l'ultima offerta "possibile" vincete */  
            aggiornaPrezzo(req.body.price,idasta)
            const offerta = await Offerta.create(data)
            res.status(200).send(offerta)
        }
        else
        {
            res.status(403).send("Credito Insufficiente")   
        }
    }
    else
    {
        if(return_info_stato.flag)
        {
            if(return_tipo_asta.flag)
            {
                console.log("Asta in esecuzione e Prezzo Accettato")
            }
            else
            {
                res.status(412).send(return_tipo_asta.risposta)
            }
        }
        else
        {
            res.status(412).send(return_info_stato.risposta)
        }

    }

}



function statoAsta(tipo){
    let answer
    if (tipo=='in esecuzione')
    {
       answer={
        flag:true,
        risposta:""
       } 
       return answer
    }
    else
    {
        answer={
            flag:false,
            risposta:`L'offerta a questa asta non puoi farla perchè la tua asta è ${tipo}`
        }
    }
    return answer
}

function tipologiaAsta(tipo, prezzo, offerta){
    let answer
    switch (tipo) {
        case 0:
          if(offerta>prezzo)
          {
            answer={
                flag:true,
                risposta:""
            }
          }
          else
          {
            answer={
                flag:false,
                risposta:"La tua Offerta è più bassa del prezzo attuale"
            }
          }
          break;
        case 1:
            if(offerta<prezzo)
            {
              answer={
                  flag:true,
                  risposta:""
              }
            }
            else
            {
              answer={
                  flag:false,
                  risposta:"La tua Offerta è più alta del prezzo attuale"
              }
            }
          break;
        default:
            answer={
                flag:true,
                risposta:""
            };
      }
      return answer
}

async function aggiornaPrezzo(prezzo,astaID) {
    
    let info={
        price_now:prezzo
    }
    await Asta.update(info, {where: {id: astaID}})
    
  }

module.exports = {
    addOffertaToken
}