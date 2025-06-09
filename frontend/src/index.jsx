import React from 'react'
import { createRoot } from 'react-dom/client'
import Init from './Init.jsx'

const container = document.getElementById('chat')

Init().then((element) => {
  const root = createRoot(container)
  root.render(element)
})