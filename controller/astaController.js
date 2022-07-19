const db = require ('../models')
const { Op, fn, col } = require("sequelize");
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
require('dotenv').config()

// Mi importo i miei controller per la gestione del database
const Asta= db.asta
const User= db.user
const Offerta= db.offer

let answer_chiamata

//Creazione di un Asta
const addAsta=  async (req, res)=> {
    
    /* In questo caso mi vado ad istanziare due vettori che mi servono per far rispettare le tipologie e gli stati dll'asta
       che un bid-creator può inserire*/
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
    
    //Informazioni dell'Asta da inserire per la creazione dell'asta
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
    
    /* Adesso vado a verificare le informazioni o per lo meno le informazioni necessarie affinchè l'asta che si va
       a creare rispetta i requisiti minimi. Quindi controllo se la tipologia dell'asta, è una di quelle consentite,
       se lo stato dell'asta è tra quelle idonee e se la data di fine dell'asta non inferiore rispetto a quella di partenza */
    if (tipo_di_asta.includes(info.type.toLowerCase())&& verify_stato.includes(info.state))
    {
        
        
        let return_info=controllaData(info.auctionTimeStart,info.auctionTimeFinish)
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


// Ottenere le offerte di un'asta aperta o meglio in esecuzione
const getApertaAstaOfferta =  async (req, res) => {

    const stato='in esecuzione'
    
    /* Ora eseguo le query per tutte le tipologie di aste che il nostro "eventuale sito" di asta dovrà gestire.
       Tali query vengono fatte attraverso le foreign key dell'asta sull'AstaID della tabella offers. In questo modo
       otteniamo per ogni asta le proprie offerte eseguite */
    const data_inglese = await Asta.findAll({
        include: [{
            model: Offerta,
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



    // Ottenute le offerte per ogni tipologia di asta le metto insieme e le visualizzo
    let informazioni={
        asta_inglese:data_inglese,
        asta_olandese:data_olandese,
        asta_busta_chiusa_up:data_bustachiusa_up,
        asta_busta_chiusa_2up:data_bustachiusa_2up
    }

    res.status(200).send(informazioni)

}

//Aggiungo una nuova proposta che nel nostro caso è un semplice offerta che presenta il banditore ai possibili acquirenti
const addProposta= async (req, res)=> {
    const id_asta=req.params.ida
    
    let info={
        nuova_proposta:req.body.nuova_proposta
    }
    const proposta = await Asta.update(info, {where: {id: id_asta}})
    res.status(200).send(proposta)
}

//Statistiche che effettua un Admin in base all'intervallo di tempo
const statiStiche =  async (req, res) => {

    //Converto le date nel formato desiderato per la propria analisi
    const dataTimeInizio=convertTZ(req.body.inizio)
    const dataTimeFine=convertTZ(req.body.fine)
    
    //Ottengo le tipologie di asta che abbiamo nella nostra tabella nel DB
    let tipologiaAsta= await Asta.findAll({
        attributes: 
                
                [
                [fn('DISTINCT', col('type')), 'tipo'],
                ]

            ,
    })

    
    let array_res=[]
    
    // Per ogni tipologia di asta  prendo le informazioni necessarie
    for (const indice in tipologiaAsta) {
        /* Estrapolo dalla tabella delle Aste il numero delle aste in base alla tipologia dell'asta filtrandole con quelle
           aste che sono terminate e quindi possono essere soggette ad analisi. Natulamente in base al periodo di interesse*/
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
        
        const numero_delle_aste=Object.keys(numero_asta).length

        let numero_partecipanti=[]
        let minValue=0
        let maxValue=0
        let medio=0

        /** Adesso vado a prendere per ogni asta il numero dei partecipanti in modo tale da poter calcolare in minimo,
         *  il massimo e la media dei partecipanti in base alla tipologia dell'asta
         */
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

            
            numero_partecipanti.push(Object.keys(data).length)
            
            //Calcolo la media
            const average = (array) => array.reduce((a, b) => a + b) / array.length;
            medio= average(numero_partecipanti)

            //Calcolo il valore massimo
            maxValue = Math.max(...numero_partecipanti);
            
            //Calcolo il valore minimo
            minValue = Math.min(...numero_partecipanti);

        }

        //Restituisco le mie statistiche
        let statistica= {
            Tipologia_Asta:tipo_asta,
            Numero_di_Aste:numero_delle_aste,
            Numero_medio_partecipanti:medio,
            Numero_minimo_partecipanti:minValue,
            Numero_massimo_Partecipanti:maxValue

        }
        array_res.push(statistica)
    }

    res.status(200).send(array_res)
}

/** In questo caso si è deciso di fare un round decidendo il tempo (millisencondi) e il prezzo da aumentare in base alle due tipologie
 * di aste, decidendo tali informazioni in input senza andarli a cercare nel DB. Inoltre con il tempo del Round si è scelto
 * di ritardare il post in modo tale che durante il tempo di attesa si possono avere altre offerte.
 * Ai fini del progetto si consiglia di utilizzare dei millisecondi piccolo [Nel mio caso ho utilizzato 5000 millisecondi]
 */
const roundAsta =  async (req, res) => {
    console.log('INIZIO DEL ROUND');
    const id_asta= req.params.ida
    const tempo_round=req.body.tempo
    const prezzo_round=req.body.prezzo_round
    const result = await esecuzioneRound(tempo_round);
    // Finito il tempo di atteza aggiorno il prezzo.
    aggiornaPrezzoNow(id_asta,prezzo_round)
    console.log(result);
    res.status(200).send(result)
}

//Caso di Vincita dell'Asta
/** Questa richiesta è stata fatta in quanto una volta che un asta finisce il suo tempo passa in terminata
 *  e si assegna il vincitore. */
const vincitaAsta= async (req, res)=> {
    
    //Ottengo la data e il tempo attuale per far terminare l'asta e assegnare il vincitore
    const data_attuale= dataOdierna()

    //Prendo tutte le aste che sono in esecuzione
    const vincitore = await Asta.findAll({
        where: {[Op.and]:[
            {state:'in esecuzione'},
            {auctionTimeFinish:{[Op.gt]:data_attuale}},
            ]}
    })

    let elenco_vincitori={
        
    }

    /** Adesso vado a cercare il vincitore in base alle tipologie delle aste. Come primo passo, si aggiorna lo stato
     * dell'asta in esecuzione allo stato di terminata. Poi per le aste inglese ed olandese vado a cercare quell'utente
     * che ha l'offerta pari al price_now perchè price_now rappresenta in queste due tipologie di aste l'ultima offerta
     * accetta e siccome lo stato dell'asta è passata nello stato di terminata, sarà anche l'ultima offerta accettata e 
     * di conseguenza quella vincente. Invece per le altre due tipologie di aste vado a cercare tra le offerte quelle 
     * che rispettano le regole per assegnare il vincitore. Una volta fatto il controllo su quale è ll'offerta vincente,
     * vado ad aggiornare la colonna winner inserendo l'ID del vincitore. Per uno sviluppo futuro possiamo prendere i 
     * dati del vincitore in quanto possiamo la colonna winner è legata alla colonna dell'User attraverso la foreign key */ 

    for (const indice in vincitore) {
         
        //Aggiorno lo stato dell'asta passandola nello stao di terminata
        aggiornaStatoAsta(vincitore[indice].id)
        
        //Vado a cercare il vincitore
        let risultato_vincitore= await cercoVincitoreAsta(vincitore[indice].id,vincitore[indice].price_now,vincitore[indice].type)
        if(answer_chiamata==null){}
        else
        {
            //Stabilisco il vincitore
            let vincita={
                tipo_asta:vincitore[indice].type,
                vincitore:answer_chiamata.vincitore,
                importo_vincita:answer_chiamata.price_now
            }
            elenco_vincitori=Object.assign(vincita)
        }


    }
    res.status(200).send(`Ecco i Vincitori ${JSON.stringify(elenco_vincitori)}`)



}

//Questa chiamata serve solo per far partire l'asta facendola passare dallo stato di "non aperta" allo stato "in esecuzione"
const inizioAsta = async (req, res) => {
    let id = req.params.ida
    let info={
        state:'in esecuzione'
    }
    let asta =await Asta.update(info, {where: {id: id}})
    res.status(200).send(asta)
}


/** 
 * 
 * DA QUESTA RIGA IN GIU' SONO PRESENTI LE FUNZIONI O LE CHIAMATE ASYNCRONE IN MODO TALE CHE LE OPERAZIONI QUI SOPRA
 *                                      DESCRITTE POSSONO FUNZIONARE A DOVERE
 * 
 */

function convertTZ(date) {
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
  

function dataOdierna() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Il mese parte da 0
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

module.exports = {
    addAsta,
    getStateAsta,
    getApertaAstaOfferta,
    addProposta,
    statiStiche,
    roundAsta,
    vincitaAsta,
    inizioAsta
}