import React from 'react' ;
import {BrowserRouter, Routes,Route} from "react-router-dom" ;
import Auth from './components/Auth/Auth.js';
import Home from './components/home/home.js';
import ProtectedRoute from './protectedRoute.js';
import Setting from './components/setting/setting.js';
import WishList from './components/wishlist/wishlist.js';
import Search from './components/search/search.js';
import ProDetails from './components/proDetails/proDetails.js';
import Cart from './components/cart/cart.js';
import Order from './components/order/order.js';

const App = () =>{
  return(<>
  <BrowserRouter> 
  <Routes>
  <Route path='/' element={<ProtectedRoute fallback={Auth} />} />
    <Route path='/home' element={<Home/>} />
    <Route path='/setting' element={<Setting />} />
    <Route path="/wishlist" element={<WishList />} />
    <Route path='/search' element={<Search />} />
    <Route path='/prodetails' element={<ProDetails />} />
    <Route path='/cart' element={< Cart />} />
    <Route path='/order' element={< Order />} />
  </Routes>
  </BrowserRouter>
  </>)
}

export default App ;