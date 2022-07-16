const astaController = require ('../controller/astaController.js')
const offertaController = require ('../controller/offertaController')
const autenticazioneController = require ('../auth/authentication')
const userController= require('../controller/userController')


const router = require ('express').Router()

//Router per L'autenticazione
router.post('/login/:idacc', autenticazioneController.getLogin)

//Router per l'Asta
router.post('/addAsta', autenticazioneController.verify_bid_creator, astaController.addAsta)//1
router.get('/stateAsta', astaController.getStateAsta)



router.get('/allAsta', astaController.getTutteAsta)

//Offerta
router.post('/addOfferta/:ida', autenticazioneController.verify_bid_partecipant, offertaController.addOfferta)
router.post('/addOffertaToken/:ida', autenticazioneController.verify_bid_partecipant, offertaController.addOffertaToken)
router.get('/allOfferta/:ida', offertaController.getAllOfferta)

//Ottenere Tutte le Offerte delle aste Aperte
router.get('/getApertaAstaOfferta', astaController.getApertaAstaOfferta)

router.get('/getAstaOfferta/:id', astaController.getAstaOfferta)

//Visualizzare Credito Residuo
router.get('/creditoResiduo', autenticazioneController.verify, userController.getCredito)

//Aggiungere Credito
router.put('/ricarica/:idu', autenticazioneController.verify_admin, userController.InsertCredito)

//STORICO In base All'intervallo
router.get('/storico', autenticazioneController.verify_bid_partecipant,userController.StoricoAste)

//Scalare il conto quando uno vince
router.put('/ScalaConto/:ida',autenticazioneController.verify_admin,userController.ScalaCredito)

//Aggiungi Proposta
router.put('/addProposta/:ida', autenticazioneController.verify_bid_creator, astaController.addProposta)

//Spesa Effettuata Periodo
router.get('/spesaEffettuata', autenticazioneController.verify_bid_partecipant,userController.SpesaEffettuataPeriodo)


//Statistiche Asta
router.get('/statisticheAsta/:tipo', astaController.prova)

module.exports = router
