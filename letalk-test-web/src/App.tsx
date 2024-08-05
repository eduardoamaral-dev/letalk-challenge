import React from 'react';
import './App.css';
import Home from "./pages/Home";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
   <>
     <Home></Home>
     <ToastContainer/>
   </>
  );
}

export default App;
