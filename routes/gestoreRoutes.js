const astaController = require ('../controller/astaController.js')
const offertaController = require ('../controller/offertaController')
const autenticazioneController = require ('../auth/authentication')


const router = require ('express').Router()

//Router per L'autenticazione
router.post('/login/:idacc', autenticazioneController.getLogin)

//Router per l'Asta
router.post('/addAsta', autenticazioneController.verify_bid_creator, astaController.addAsta)
router.get('/stateAsta', astaController.getStateAsta)



router.get('/allAsta', astaController.getTutteAsta)

//Offerta
router.post('/addOfferta/:ida', autenticazioneController.verify_bid_partecipant, offertaController.addOfferta)
router.get('/allOfferta/:ida', offertaController.getAllOfferta)

//Ottenere Tutte le Offerte delle aste Aperte
router.get('/getApertaAstaOfferta', astaController.getApertaAstaOfferta)

router.get('/getAstaOfferta/:id', astaController.getAstaOfferta)


module.exports = router
