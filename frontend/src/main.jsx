import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Init from './Init.jsx'

const app = async () => {
  const vdom = await Init();
  const root = createRoot(document.getElementById('chat'));
  root.render(<StrictMode>{vdom}</StrictMode>);
};

app();