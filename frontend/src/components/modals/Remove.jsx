import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useDeleteChannelMutation } from '../../slices/channelsSlice.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const Remove = ({ modalInfo: { item: channel }, onHide }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const [deleteChannel] = useDeleteChannelMutation()
  const { t } = useTranslation()
  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    deleteChannel(channel.id)
    onHide()
    toast.info(t('Channel removed'))
  }

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('Delete channel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('Are you sure?')}</p>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="d-flex justify-content-end">
              <Button onClick={onHide} variant="secondary" className="me-2">{t('Cancel')}</Button>
              <Button type="submit" variant="danger">{t('Delete')}</Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Remove