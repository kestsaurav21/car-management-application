import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import ProductListing from './pages/ProductListing'
import { Toaster } from "@/components/ui/toaster"
import ProductDetails from './pages/ProductDetails'

function App() {

  return (
    <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productList" element={<ProductListing />} />
          <Route path="/car/:id" element={<ProductDetails />} />
        </Routes>
        <Toaster />
    </div>
  )
}

export default App
