// import { Toast } from 'react-toastify/dist/components';
import {ToastContainer} from 'react-toastify';
import React from 'react'

const Toast = () => {
  return (
    <div>
        <ToastContainer hideProgressBar autoClose={1500}/>
    </div>
  )
}

export default Toast;