import { useFormik } from 'formik'
import { useEffect, useRef } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import * as Yup from 'yup'
import { useRenameChannelMutation } from '../../slices/channelsSlice.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const getValidationSchema = channelNames => Yup.object().shape({
  channelName: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field')
    .notOneOf(channelNames, 'Must be unique'),
})

const Rename = ({ modalInfo: { item: channel }, onHide, channels }) => {
  const inputRef = useRef()
  useEffect(() => {
    inputRef.current.select()
  }, [])
  const [renameChannel] = useRenameChannelMutation()
  const channelNames = channels.map(({ name }) => name)
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues: { channelName: channel.name },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: (values) => {
      const id = channel.id
      const name = values.channelName
      renameChannel({ id, name })
      onHide()
      toast.info(t('Channel renamed'))
    },
  })

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('Channel name')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden>{t('Channel name')}</Form.Label>
                <Form.Control
                  autoFocus
                  ref={inputRef}
                  onChange={formik.handleChange}
                  value={formik.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={formik.touched.channelName && formik.errors.channelName}
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {t(formik.errors.channelName)}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={onHide} variant="secondary" className="me-2">{t('Cancel')}</Button>
                <Button type="submit" variant="primary">{t('Send')}</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Rename