import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@assets/style/index.css";

import Modugno from './Modugno';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Modugno />
  </StrictMode>,
)
