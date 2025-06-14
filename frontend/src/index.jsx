import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client'
import rootReducer from './slices/index.js'
import createI18n from './i18n.js'
import { I18nextProvider } from 'react-i18next'
import App from './components/App.jsx'
import { Provider, useSelector, useStore } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { messagesApi } from './slices/messagesSlice.js'
import { channelsApi, actions as channelsActions } from './slices/channelsSlice.js'
import log from './logger.js'

let socket = null

const setupSocket = (store) => {
  const token = localStorage.getItem('token')
  if (!token) {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    return
  }

  if (socket && socket.auth && socket.auth.token === `Bearer ${token}` && socket.connected) {
    return
  }
  if (socket) {
    socket.disconnect()
    socket = null
  }

  socket = io({
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
}
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware, channelsApi.middleware),
})

const SocketManager = ({ children }) => {
  const store = useStore()
  const isAuth = useSelector((state) => state.authUser.isAuth)

  useEffect(() => {
    setupSocket(store)
    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [isAuth, store])

  return children
}

const i18n = createI18n()

const container = document.getElementById('chat')
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <SocketManager>
        <App />
      </SocketManager>
    </I18nextProvider>
  </Provider>
)
