import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className="w-full h-full bg-gray-400">
            <App/>
        </div>
    </StrictMode>,
)
