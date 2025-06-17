import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
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
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react'

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: 'production',
}

let socket = null

const container = document.getElementById('chat')

const setupSocket = (store) => {
  const token = localStorage.getItem('token')
  if (!token) {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    return
  }
  if (
    socket &&
    socket.auth &&
    socket.auth.token === token &&
    socket.connected
  ) {
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
const renderApp = async () => {
  const store = configureStore(rootReducer)
  setupSocket(store)
  store.subscribe(() => {
    const isAuthenticated = store.getState().user.isAuthenticated
    const token = localStorage.getItem('token')
    if (isAuthenticated && token) {
      setupSocket(store)
    } else {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  })

  const i18n = await createI18n()
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <Provider store={store}>
              <App />
            </Provider>
          </ErrorBoundary>
        </RollbarProvider>
      </I18nextProvider>
    </StrictMode>
  )
}

renderApp()
