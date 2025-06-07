import { useFormik } from 'formik'
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import * as Yup from 'yup'
import { useAddChannelMutation } from '../../slices/channelsSlice.js'
import { useTranslation } from 'react-i18next'
import profanityFilter from 'leo-profanity'
import { toast } from 'react-toastify'

const getValidationSchema = channelNames => Yup.object().shape({
  channelName: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field')
    .notOneOf(channelNames, 'Must be unique'),
})

const Add = ({ onHide, channels }) => {
  const [addChannel] = useAddChannelMutation()
  const { t } = useTranslation()

  const channelNames = channels.map(({ name }) => name)
  const formik = useFormik({
    initialValues: { channelName: '' },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: (values) => {
      addChannel(profanityFilter.clean(values.channelName))
      onHide()
      toast.info(t('Channel created'))
    },
  })

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('Add channel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden>{t('Channel name')}</Form.Label>
                <Form.Control
                  autoFocus
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

export default Add