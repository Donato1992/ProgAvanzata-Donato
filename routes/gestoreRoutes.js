const astaController = require ('../controller/astaController.js')
const offertaController = require ('../controller/offertaController')

const router = require ('express').Router()

//Router per l'Asta
router.post('/addAsta', astaController.upload, astaController.addAsta)
//router.post('/addAsta', astaController.addAsta)
router.get('/allAsta', astaController.getTutteAsta)
router.get('/:id', astaController.getAsta)
router.put('/:id', astaController.updateAsta)
router.delete('/:id', astaController.deleteAsta)
router.get('/pubblicata', astaController.getAstaPubblicata)


//Offerta
router.post('/addOfferta/:idu/:ida', offertaController.addOfferta)
router.get('/allOfferta/:ida', offertaController.getAllOfferta)

//Ottenere Tutte le Aste di Un Utente
router.get('/getAstaOfferta/:id', astaController.getAstaOfferta)


module.exports = router
