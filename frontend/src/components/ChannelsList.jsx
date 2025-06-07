import { PlusSquareFill } from 'react-bootstrap-icons'
import { Button, Col, Dropdown, ButtonGroup } from 'react-bootstrap'
import { actions as channelActions } from '../slices/channelsSlice.js'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

function ChannelList({ currentChannel, channels, showModal }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const currentChannelId = currentChannel ? currentChannel.id : '1'

  return (
    <Col md={2} className="col-4 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button onClick={() => { showModal('newChannel') }} type="button" className="p-0 text-primary btn btn-group-vertical">
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map(channel => (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start btn"
                variant={(channel.id === currentChannelId) && 'secondary'}
                onClick={() => { dispatch(channelActions.setCurrentChannelId(channel.id)) }}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable && (
                <Dropdown.Toggle
                  split
                  variant={channel.id === currentChannel.id && 'secondary'}
                >
                  <span className="visually-hidden">{t('Channel management')}</span>
                </Dropdown.Toggle>
              )}
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removeChannel', channel)}>{t('Delete')}</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renameChannel', channel)}>{t('Rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  )
}

export default ChannelList