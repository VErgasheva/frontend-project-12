import React from 'react'
import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client'
import rootReducer from './slices/index.js'
import createI18n from './i18n.js'
import { I18nextProvider } from 'react-i18next'
import App from './components/App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { messagesApi } from './slices/messagesSlice.js'
import { channelsApi, actions as channelsActions } from './slices/channelsSlice.js'
import log from './logger.js'

export const store = configureStore(rootReducer)

const setupSocket = (store) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  const socket = io({
    auth: { token: `Bearer ${token}` },
  })

  socket
    .on('connect', () => {
      log('Socket connected', { id: socket.id })
    })
    .on('disconnect', (reason) => {
      log('Socket disconnected', reason)
    })
    .on('newMessage', (payload) => {
      log('Message event', payload)
      store.dispatch(messagesApi.util.invalidateTags(['Messages']))
    })
    .on('newChannel', (payload) => {
      log('Channel created', payload)
      store.dispatch(channelsApi.util.invalidateTags(['Channels']))
    })
    .on('removeChannel', (payload) => {
      log('Channel removed', payload)
      store.dispatch(channelsApi.util.invalidateTags(['Channels']))
      store.dispatch(channelsActions.selectChannel('1'))
    })
    .on('renameChannel', (payload) => {
      log('Channel renamed', payload)
      store.dispatch(channelsApi.util.invalidateTags(['Channels']))
    })
  return socket
}

const renderApp = async () => {
  let socket = null

  let prevAuth = Boolean(localStorage.getItem('token'))
  if (prevAuth) {
    socket = setupSocket(store)
  }

  store.subscribe(() => {
    const isAuthenticated = store.getState().user.isAuthenticated
    const token = localStorage.getItem('token')
    if (isAuthenticated && token) {
      if (!socket) {
        socket = setupSocket(store)
      }
    } else {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
    prevAuth = isAuthenticated
  })

  const i18n = await createI18n()
  const container = document.getElementById('chat')
  const root = createRoot(container)
  root.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  )
}

renderApp()
