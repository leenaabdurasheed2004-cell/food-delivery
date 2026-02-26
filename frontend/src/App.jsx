import React, { useState } from 'react'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/placeOrders/PlaceOrder'
import Footer from './components/footer/footer'
import Loginpopup from './components/loginpopup/Loginpopup'
import Verify from './pages/verify/Verify'
import MyOrders from './pages/myOrders/MyOrders'


const App = () => {

  const [showogin,setShowLogin]=useState(false)
  return (
    <>
    {showogin?<Loginpopup setShowLogin={setShowLogin}/>:<></>}
        <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>       
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>}/>
      </Routes>
    </div>
    <Footer/>

    </>
  )
}

export default App