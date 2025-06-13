import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetChannelsQuery } from '../slices/channelsSlice.jsx'
import ChannelsList from './ChannelsList.jsx'
import Chat from './Chat.jsx'
import Container from 'react-bootstrap/esm/Container.js'
import Row from 'react-bootstrap/Row'
import getModalComponent from './modals/index.js'

const ModalRenderer = ({ modalInfo, onClose, channels }) => {
  if (!modalInfo.type) return null
  const ModalComponent = getModalComponent(modalInfo.type)
  return (
    <ModalComponent
      modalInfo={modalInfo}
      onHide={onClose}
      channels={channels}
    />
  )
}

function HomePage() {
  const { data: channels, isSuccess } = useGetChannelsQuery()
  const selectedChannelId = useSelector(state => state.channels.selectedChannelId)
  const selectedChannel = channels && channels.find(channel => channel.id === selectedChannelId)
  const [modalInfo, setModalInfo] = useState({ type: null, item: null })
  const closeModal = () => setModalInfo({ type: null, item: null })
  const openModal = (type, item = null) => setModalInfo({ type, item })

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        { isSuccess && (<ChannelsList currentChannel={selectedChannel} channels={channels} showModal={openModal} />) }
        { selectedChannel && (<Chat currentChannel={selectedChannel} />) }
      </Row>
      <ModalRenderer modalInfo={modalInfo} onClose={closeModal} channels={channels} />
    </Container>
  )
}

export default HomePage
