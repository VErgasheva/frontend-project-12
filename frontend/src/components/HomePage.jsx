import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetChannelsQuery } from '../slices/channelsSlice.js'
import ChannelsList from './ChannelsList.jsx'
import Chat from './Chat.jsx'
import Container from 'react-bootstrap/esm/Container.js'
import Row from 'react-bootstrap/Row'
import getModalComponent from './modals/index.js'
import { actions as channelsActions } from '../slices/channelsSlice.js'

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
  const dispatch = useDispatch()
  const selectedChannelId = useSelector(state => state.channels.selectedChannelId)
  const selectedChannel = channels && channels.find(channel => String(channel.id) === String(selectedChannelId))
  const [modalInfo, setModalInfo] = useState({ type: null, item: null })
  const closeModal = () => setModalInfo({ type: null, item: null })
  const openModal = (type, item = null) => setModalInfo({ type, item })

  useEffect(() => {
    if (isSuccess && channels.length > 0) {
      const exists = channels.some(c => String(c.id) === String(selectedChannelId))
      if (!exists) {
        dispatch(channelsActions.selectChannel(String(channels[0].id)))
      }
    }
  }, [isSuccess, channels, selectedChannelId, dispatch])

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
