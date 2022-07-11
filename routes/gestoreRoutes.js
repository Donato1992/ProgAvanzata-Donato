const productController = require ('../controller/productController.js')
const reviewController = require ('../controller/reviewController.js')

const router = require ('express').Router()
router.post('/addProduct', productController.upload, productController.addProduct)
router.get('/allProducts', productController.getAllProduct)
router.get('/:id', productController.getOneProduct)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
router.get('/published', productController.getPublishedProduct)


//Review e Controller
router.get('/allReviews', reviewController.getAllReviews)
router.post('/addReview/:id', reviewController.addReview)

//Ottenere i Product Reviews
router.get('/getProductReviews/:id', productController.getProductReviews)


module.exports = router
