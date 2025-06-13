import { PlusSquareFill } from 'react-bootstrap-icons'
import { Button, Col, Dropdown, ButtonGroup } from 'react-bootstrap'
import { actions } from '../slices/channelsSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

function ChannelsList({ currentChannel, channels, showModal }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const selectedChannelId = useSelector(state => state.channels.selectedChannelId)

  return (
    <Col md={2} className="col-4 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('Channels')}</b>
        <button onClick={() => { showModal('newChannel') }} type="button" className="p-0 text-primary btn btn-group-vertical">
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map(channel => {
          const isSelected = String(channel.id) === String(selectedChannelId)
          return (
            <li className="nav-item w-100" key={channel.id}>
              <Dropdown as={ButtonGroup} className="d-flex">
                <Button
                  className="w-100 rounded-0 text-start btn"
                  variant={isSelected ? 'secondary' : undefined}
                  onClick={() => { dispatch(actions.selectChannel(channel.id)) }}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
                {channel.removable && (
                  <>
                    <Dropdown.Toggle
                      split
                      variant={isSelected ? 'secondary' : undefined}
                    >
                      <span className="visually-hidden">{t('Channel management')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => showModal('removeChannel', channel)}>{t('Delete')}</Dropdown.Item>
                      <Dropdown.Item onClick={() => showModal('renameChannel', channel)}>{t('Rename')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </>
                )}
              </Dropdown>
            </li>
          )
        })}
      </ul>
    </Col>
  )
}
export default ChannelsList
