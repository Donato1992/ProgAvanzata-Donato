/* 

Qui Vado a selezionare tutti i miei controlli dove vado a gestire le mie chiamate

*/

const astaController = require ('../controller/astaController.js')
const offertaController = require ('../controller/offertaController')
const autenticazioneController = require ('../auth/authentication')
const userController= require('../controller/userController')


const router = require ('express').Router()

//Autenticazione
router.post('/login/:idacc', autenticazioneController.getLogin)

//Aggiunta Asta con verifica del bid-creator
router.post('/addAsta', autenticazioneController.verify_bid_creator, astaController.addAsta)

//Visualizzo le mie aste in base allo stato
router.get('/stateAsta', astaController.getStateAsta)


//Aggiungere una nuova offerta con la verifica del ruolo di bid-partecipant
router.post('/addOffertaToken/:ida', autenticazioneController.verify_bid_partecipant, offertaController.addOffertaToken)


//Ottenere Tutte le Offerte delle aste Aperte
router.get('/getApertaAstaOfferta', astaController.getApertaAstaOfferta)

//Visualizzare Credito Residuo Utente con controllo accesso bid-partecipant
router.get('/creditoResiduo', autenticazioneController.verify_bid_partecipant, userController.getCredito)

//Aggiungere Credito con controllo accesso dell'admin
router.put('/ricarica/:idu', autenticazioneController.verify_admin, userController.InsertCredito)

//Storico In base All'intervallo di tempo con controllo accesso bid partecipant
router.get('/storico', autenticazioneController.verify_bid_partecipant,userController.StoricoAste)

//Scalare il conto quando esiste un vincitore
router.put('/ScalaConto/:ida',autenticazioneController.verify_admin,userController.ScalaCredito)

//Aggiungere la proposta con controllo accesso bid-creator
router.put('/addProposta/:ida', autenticazioneController.verify_bid_creator, astaController.addProposta)

//Spesa Effettuata in un dato intervallo di tempo con controlllo acceso bid-partecipant
router.get('/spesaEffettuata', autenticazioneController.verify_bid_partecipant,userController.SpesaEffettuataPeriodo)


//Statistiche Asta con controllo accesso admin
router.get('/statisticheAsta', autenticazioneController.verify_admin,astaController.statiStiche)


//Vado a stabilire chi è il vincitore dell'asta
router.post('/vincitaAsta', astaController.vincitaAsta)

// Round dell'asta
router.put('/roundAsta/:ida', astaController.roundAsta)

// Avvio di un asta
router.put('/avvioAsta/:ida', astaController.inizioAsta)

module.exports = router
