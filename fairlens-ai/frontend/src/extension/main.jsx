import React from 'react'
import ReactDOM from 'react-dom/client'
import ExtensionApp from './ExtensionApp.jsx'
import '@/index.css' // Reuse the global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExtensionApp />
  </React.StrictMode>,
)
