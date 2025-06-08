import { io } from 'socket.io-client'
import rootReducer from './slices/index.js'
import createI18n from './i18next.js'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react'
import App from './components/App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { messagesApi } from './slices/messagesSlice.js'
import { channelsApi, actions as channelsActions } from './slices/channelsSlice.js'
import log from './logger.js'

export const store = configureStore(rootReducer)
const Init = async () => {
  const socket = io()
  socket
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
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: 'production',
  }
  const i18n = await createI18n()
  return (
    <I18nextProvider i18n={i18n}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <App />
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  )
}

export default Init
