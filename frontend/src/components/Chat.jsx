import Col from 'react-bootstrap/Col'
import { useEffect } from 'react'
import { useGetMessagesQuery } from '../slices/messagesSlice'
import { useTranslation } from 'react-i18next'
import { animateScroll } from 'react-scroll'
import Message from './Message'
import MessageForm from './MessageForm'

function Chat({ currentChannel }) {
  const { t } = useTranslation()
  const { data: messages, isSuccess } = useGetMessagesQuery()
  const currentUsername = localStorage.getItem('username')
  const channelId = currentChannel.id
  const currentChannelMessages = isSuccess && messages.filter(message => message.channelId === channelId)
  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 })
  }, [currentChannelMessages.length])
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0"><b>{`# ${currentChannel.name}`}</b></p>
          <span className="text-muted">{t('messagesCount', { count: currentChannelMessages.length })}</span>
        </div>
        <div id="messages-box" className="overflow-auto px-5 ">
          {isSuccess && currentChannelMessages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <MessageForm channelId={channelId} currentUsername={currentUsername} />
        </div>
      </div>
    </Col>
  )
}

export default Chat
