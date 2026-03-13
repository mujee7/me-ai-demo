import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './style.css'
import { Web3Provider } from './web3'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>,
)

