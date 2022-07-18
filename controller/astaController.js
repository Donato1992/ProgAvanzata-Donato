const db = require ('../models')
const { Op, fn, col } = require("sequelize");
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()

//Creao il Main del Controller
const Asta= db.asta
const User= db.user
const Offerta= db.offer

let answer_chiamata

//Creazione Asta
const addAsta=  async (req, res)=> {
    let tipo_di_asta=["asta inglese","asta olandese","asta busta chiusa up","asta busta chiusa 2up"]
    let verify_stato=["non aperta","in esecuzione","terminata"]
    let flag=new Boolean(true)
    let tipo_di_asta_accettati= {
        1:"asta inglese",
        2:"asta olandese",
        3:"asta busta chiusa up",
        4:"asta busta chiusa 2up"
    }
    let tipo_di_stato_accettati= {
        1:"non aperta",
        2:"in esecuzione",
        3:"terminata",
    }
    console.log('AGGIUNGO ASTACAZZOOO--->'+Object.keys(req.user.utente))
    console.log("SONO DENTRO ADDASTA---->"+req.user.utente.id)
    let info = {
        title: req.body.title,
        type: req.body.type.toLowerCase(),
        price_open: req.body.price_open,
        description: req.body.description,
        auctionTimeStart: req.body.auctionTimeStart,
        auctionTimeFinish: req.body.auctionTimeFinish,
        price_now: req.body.price_open,
        state: req.body.state.toLowerCase(),
        UserID: req.user.utente.id
        
    }
    console.log("Vediamo--> "+tipo_di_asta)
    console.log("Vediamo--> "+tipo_di_asta.includes(info.type.toLowerCase()))
    console.log("Vediamo--> "+verify_stato.includes(info.state))
    console.log('VEDIAMO LE INFOOOO'+info.title)
    
    if (tipo_di_asta.includes(info.type.toLowerCase())&& verify_stato.includes(info.state))
    {
        
        let return_info=controllaData(info.auctionTimeStart,info.auctionTimeFinish)
        console.log("CONTROLLO DATE"+return_info.controllo)
        if(flag&&return_info.controllo)
        {
            const asta = await Asta.create(info)
            res.status(200).send(asta)
        }
        else
        {
            res.status(400).send(return_info.messaggio)
        }
    }
    else
    {
        if (tipo_di_asta.includes(info.type.toLowerCase()))
        {
            res.status(400).send(`Stato dell'Asta non Ammesso\n Sono ammessi solo questi tipi di stati\n${JSON.stringify(tipo_di_stato_accettati)}`)
        }
        else
        {
            res.status(400).send(`Tipologia dell'Asta non Ammessa\n Sono ammesse solo queste tipologie di aste\n${JSON.stringify(tipo_di_asta_accettati)}`)
        }
    }
    
    //console.log(asta)
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

const getApertaAstaOfferta =  async (req, res) => {

    let tipo_di_asta=["asta inglese","asta olandese","asta busta chiusa up","asta busta chiusa 2up"]
    const stato='in esecuzione'
    console.log("MIO STATOOOO---->"+stato)

    const data_inglese = await Asta.findAll({
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        order:[
            [col('Offer.price'), 'ASC']
        ],
        where: {[Op.and]:[
            {state:stato},
            {type:"asta inglese"}
        ],
        }
        
    })

    const data_olandese = await Asta.findAll({
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        order:[
            [col('Offer.price'), 'DESC']
        ],
        where: {[Op.and]:[
            {state:stato},
            {type:"asta olandese"}
        ],
        }
        
    })

    const data_bustachiusa_up = await Asta.findAll({
        where: {[Op.and]:[
            {state:stato},
            {type:"asta busta chiusa up"}
        ],
        }
        
    })

    const data_bustachiusa_2up = await Asta.findAll({
        where: {[Op.and]:[
            {state:stato},
            {type:"asta busta chiusa 2up"}
        ],
        }
        
    })




    let informazioni={
        asta_inglese:data_inglese,
        asta_olandese:data_olandese,
        asta_busta_chiusa_up:data_bustachiusa_up,
        asta_busta_chiusa_2up:data_bustachiusa_2up
    }

    

    //console.log("VEDIAMO QUESTO-->"+Object.keys(data))
    //let return_tipo_asta=tipologiaAsta(tipo_di_asta.indexOf(tipo.type))




    //console.log(data)
    res.status(200).send(informazioni)

}

const addProposta= async (req, res)=> {
    const id_asta=req.params.ida
    
    let info={
        nuova_proposta:req.body.nuova_proposta
    }
    const proposta = await Asta.update(info, {where: {id: id_asta}})
    res.status(200).send(proposta)
}


const prova2 =  async (req, res) => {

    const tipo_asta= req.params.tipo
    const dataTimeInizio=convertTZ(req.body.inizio)
    const dataTimeFine=convertTZ(req.body.fine)  

    let data = await Asta.findAll({
        attributes: {
            include: [
              [fn('COUNT', col('Offer.id')), 'Conteggio'],
            ]
          },
        include: [{
            model: Offerta,
            // Per Esempio as Bid è La chiave primaria dove fare il Join che è presente nel Index
            // della cartella Model
            as: 'Offer'
        }],
        where: {
            [Op.and]:[
                //{UserID:req.user.utente.nome,},
                {type:tipo_asta},
                {state:'terminata'},
                //RICORDATI CHE CON POSTMAN L'OROLOGIO E' INDIETRO DI DUE ORE QUINDI AL CREATEDAT DEVI AGGIUNGERE DUE ORE
                {auctionTimeFinish:{[Op.gt]:dataTimeInizio}},
                {auctionTimeFinish:{[Op.lt]:dataTimeFine}},]
        }
        
    })
    console.log(data)
    res.status(200).send(data)
}



//Statistiche Admin

const statiStiche =  async (req, res) => {

    
    const dataTimeInizio=convertTZ(req.body.inizio)
    const dataTimeFine=convertTZ(req.body.fine)
    

    let tipologiaAsta= await Asta.findAll({
        attributes: 
                
                [
                [fn('DISTINCT', col('type')), 'tipo'],
                ]

            ,
    })
    let array_res=[]
    console.log("TIPOLOGIA ASTA--->"+Object.keys(tipologiaAsta[0].dataValues))
    for (const indice in tipologiaAsta) {
        console.log(`${tipologiaAsta[indice].dataValues.tipo} is at position ${indice}`)
    
        tipo_asta=tipologiaAsta[indice].dataValues.tipo
        let numero_asta= await Asta.findAll({
            where:{[Op.and]:[
                //{UserID:req.user.utente.nome,},
                {type:tipo_asta},
                {state:'terminata'},
                //RICORDATI CHE CON POSTMAN L'OROLOGIO E' INDIETRO DI DUE ORE QUINDI AL CREATEDAT DEVI AGGIUNGERE DUE ORE
                {auctionTimeFinish:{[Op.gt]:dataTimeInizio}},
                {auctionTimeFinish:{[Op.lt]:dataTimeFine}},]}
        })
        console.log("Numero Aste--->"+Object.keys(numero_asta).length)
        const numero_delle_aste=Object.keys(numero_asta).length

        let numero_partecipanti=[]
        let minValue=0
        let maxValue=0
        let medio=0
        for (const indice in numero_asta) {
            
        console.log(`${numero_asta[indice].id} is at position ${indice}`)
        




            // Ottengo il Numero di Partecipanti
            let data = await Offerta.findAll({
                attributes: 
                    
                    [
                    [fn('DISTINCT', col('UserID')), 'Utenti'],
                    ]

                ,
                where:{AstaID:numero_asta[indice].id}
                
            })

            

            console.log("Veiamo Il Numero Partecipanti--->  "+Object.keys(data).length)
            numero_partecipanti.push(Object.keys(data).length)
            const average = (array) => array.reduce((a, b) => a + b) / array.length;
            console.log("NUMERO MEDIO"+average(numero_partecipanti));
            medio= average(numero_partecipanti)
            maxValue = Math.max(...numero_partecipanti);

            console.log("Valore Massimo-->"+maxValue);

            minValue = Math.min(...numero_partecipanti);

            console.log("Valore Minimo-->"+minValue);
        }

        let statistica= {
            Tipologia_Asta:tipo_asta,
            Numero_di_Aste:numero_delle_aste,
            Numero_medio_partecipanti:medio,
            Numero_minimo_partecipanti:minValue,
            Numero_massimo_Partecipanti:maxValue

        }
        array_res.push(statistica)
        // Fine Codice Ottengo numero di Partecipanti
    }
    console.log("Vediamo Array->")
    //console.log(numero_partecipanti)

    //console.log(numero_asta)
    res.status(200).send(array_res)
}

function convertTZ(date) {
    console.log("VEDIAMO LA DATA---->"+date)
    let dataPart=date.split(/[- :]/)
    dataPart[3]=Number(dataPart[3])+2
    console.log("PARTI-->"+dataPart[0]+dataPart[1]+dataPart[2]+dataPart[3]+dataPart[4]+dataPart[5])
    const new_date=dataPart[0]+"-"+dataPart[1]+"-"+dataPart[2]+" "+dataPart[3]+":"+dataPart[4]+":"+dataPart[5]
    return new_date
  }

function controllaData(inizio,fine){
    let flag=new Boolean(true)
    let errore_string=''
    if(Date.parse(fine)>Date.parse(inizio)&&Date.parse(inizio)>Date.parse(new Date()))
    {
        console.log("Check Date Ok")
    }
    else
    {
        if (Date.parse(fine)>Date.parse(inizio))
        {
            if (Date.parse(inizio)>Date.parse(new Date()))
            {
                console.log("Check Date Ok")
            }
            else
            {
                flag=false
                errore_string=`La data di Inizio dell'Asta non può essere inferiore a quella della data Odierna`
            }
        }
        else
        {
            flag=false
            errore_string=`La data di Inizio dell'Asta non può essere inferiore alla data di Fine dell'Asta`
        }
    }
    let answer={controllo:flag,messaggio:errore_string}
    return answer
}


function tipologiaAsta(IDasta,offerta_vincente,tipo){
    let answer
    switch (tipo) {
        case 0:
            answer_chiamata=""
            answer=trovoVincitoreAstaIngleseOlandese(IDasta,offerta_vincente)
          break;
        case 1:
            answer_chiamata=""
            answer=trovoVincitoreAstaIngleseOlandese(IDasta,offerta_vincente)
            console.log("Sono NELL'ASTA OLANDESE")
          break;
        case 2:
            answer_chiamata=""
            answer=trovoVincitoreAstaBustaChiusa(IDasta,0)
            break;
        case 3:
            answer_chiamata=""
            answer=trovoVincitoreAstaBustaChiusa(IDasta,1)
            break;
        default:
            answer={
                vincitore:"",
                price_now:""
            };
      }
      return answer
}


function esecuzioneRound(tempo_round) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Round Finito');
      }, tempo_round);
    });
  }
  
  async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
    // expected output: "resolved"
  }
  
  //asyncCall();
  




  const roundAsta =  async (req, res) => {
    console.log('INIZIO DEL ROUND');
    const id_asta= req.params.ida
    const tempo_round=req.body.tempo
    const prezzo_round=req.body.prezzo_round
    const result = await esecuzioneRound(tempo_round);
    aggiornaPrezzoNow(id_asta,prezzo_round)
    console.log(result);
    res.status(200).send(result)
}





const vincitaAsta= async (req, res)=> {
    
    //const data_attuale= dataOdierna()
    const data_attuale= '2022-07-14 07:23:52'
    console.log(data_attuale)
    //Le Aste
    const vincitore = await Asta.findAll({
        where: {[Op.and]:[
            {state:'in esecuzione'},
            {auctionTimeFinish:{[Op.gt]:data_attuale}},
            ]}
    })

    let elenco_vincitori={
        
    }

    for (const indice in vincitore) {
         
        //console.log(`${vincitore[indice].price_now} is at position ${indice} con la simma di`)
        aggiornaStatoAsta(vincitore[indice].id)
        let risultato_vincitore= await cercoVincitoreAsta(vincitore[indice].id,vincitore[indice].price_now,vincitore[indice].type)
        if(answer_chiamata==null){}
        else
        {
            console.log("ORA CI SIAMO--------------->"+answer_chiamata.vincitore+"-"+answer_chiamata.price_now)
            let vincita={
                tipo_asta:vincitore[indice].type,
                vincitore:answer_chiamata.vincitore,
                importo_vincita:answer_chiamata.price_now
            }
            elenco_vincitori=Object.assign(vincita)
        }
        //console.log("VINCITOREEE-->"+risultato_vincitore.vincitore+"----"+risultato_vincitore.price_now)


    }
    res.status(200).send(`Ecco i Vincitori ${JSON.stringify(elenco_vincitori)}`)



}


function dataOdierna() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let hour=today.getHours();
    let minute=today.getMinutes();
    let second=today.getSeconds();
    console.log(hour+":"+minute+":"+second)
    const tempo=hour+":"+minute+":"+second

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const data_formattata = yyyy + '-' + mm + '-' + dd;
    const data_finale=data_formattata+" "+tempo
    console.log(data_finale)
    return data_finale
  }



  async function aggiornaStatoAsta(astaID) {
    let info={
        state:'terminata'
    }
    await Asta.update(info, {where: {id: astaID}})
    
   
  }

  function cercoVincitoreAsta(astaID,offerta_vincenta,tipo) {
    
    let tipo_di_asta=["asta inglese","asta olandese","asta busta chiusa up","asta busta chiusa 2up"]

    let il_vincitore_asta=tipologiaAsta(astaID,offerta_vincenta,tipo_di_asta.indexOf(tipo))

    

    return il_vincitore_asta
  }


  async function trovoVincitoreAstaIngleseOlandese(astaID,offerta_vincente) {
    
    const risultato=await Offerta.findOne({
        where: {[Op.and]:[
            {AstaID:astaID},
            {price:offerta_vincente}
        ],
        },
        raw:true
    })

    if (risultato==null){}
    else
    {
        answer_chiamata={
            vincitore:risultato.UserID,
            price_now:risultato.price
        }
        aggiornaStatoAstaIngleseOlandese(astaID,risultato.UserID)   
    }

  }

  async function trovoVincitoreAstaBustaChiusa(astaID,tipo) {
    
    let risultato=await Offerta.findAll({
        where: { AstaID:astaID},
        order:[
            ['price', 'DESC']
        ]
        
    })
    if (risultato==null){}
    else
    {
        if(tipo==0)
        {
            answer_chiamata={
                vincitore:risultato[tipo].UserID,
                price_now:risultato[tipo].price
            }
            aggiornaStatoAstaBuste(astaID,risultato[tipo].price,risultato[tipo].UserID)
        }
        else
        {
            answer_chiamata={
                vincitore:risultato[tipo].UserID,
                price_now:risultato[tipo].price
            }
            aggiornaStatoAstaBuste(astaID,risultato[tipo].price,risultato[tipo].UserID)
        }
    }
  }

  async function aggiornaStatoAstaBuste(astaID,price,win) {
    let info={
        price_now:price,
        winner:win
    }
    await Asta.update(info, {where: {id: astaID}})
    
   
  }
  async function aggiornaStatoAstaIngleseOlandese(astaID,win) {
    let info={
        winner:win
    }
    await Asta.update(info, {where: {id: astaID}})
    
   
  }

  async function aggiornaPrezzoNow(astaID,prezzo) {

    console.log(astaID)
    const prendo_asta=await Asta.findOne({
        where:{id:astaID}
    })
    if(prendo_asta.type=="asta inglese")
    {
        const prezzo_aggiornato=prendo_asta.price_now+prezzo
        let info={
            price_now:prezzo_aggiornato
        }
        await Asta.update(info, {where: {id: astaID}})
    }
    if(prendo_asta.type=="asta olandese")
    {
        const prezzo_aggiornato=prendo_asta.price_now-prezzo
        let info={
            price_now:prezzo_aggiornato
        }
        await Asta.update(info, {where: {id: astaID}})
    }
    
   
  }

  //Update Asta
const inizioAsta = async (req, res) => {
    let id = req.params.ida
    let info={
        state:'in esecuzione'
    }
    let asta =await Asta.update(info, {where: {id: id}})
    res.status(200).send(asta)
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
    statiStiche,
    roundAsta,
    vincitaAsta,
    inizioAsta
}