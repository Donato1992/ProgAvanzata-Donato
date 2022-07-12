import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddProduct from './screen/AddProduct'
import EditProduct from './screen/EditProduct'
import ProductDetail from './screen/ProductDetail'
import ShowProducts from './screen/ShowProducts'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/addProduct' element={<AddProduct />} />
        <Route path='/products' element={<ShowProducts />} />
        <Route path='/product/edit/:id' element={<EditProduct />} />
        <Route path='/product/:id' element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}

export default App