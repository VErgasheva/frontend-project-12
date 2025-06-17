import { useFormik } from 'formik'
import { ArrowRightSquare } from 'react-bootstrap-icons'
import { useSendMessageMutation } from '../slices/messagesSlice'
import { useTranslation } from 'react-i18next'
import profanityFilter from 'leo-profanity'

function MessageForm({ channelId, currentUsername }) {
  const [sendMessage, { isLoading }] = useSendMessageMutation()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: { message: '' },
    onSubmit: (values, { resetForm }) => {
      const cleanMessage = profanityFilter.clean(values.message)
      sendMessage({ body: cleanMessage, channelId, currentUsername })
      resetForm()
    },
  })

  return (
    <form
      noValidate=""
      className="py-1 border rounded-2"
      onSubmit={formik.handleSubmit}
    >
      <fieldset disabled={isLoading}>
        <div className="input-group has-validation">
          <input
            autoFocus
            name="message"
            aria-label={t('A new message')}
            placeholder={t('Enter your message...')}
            className="border-0 p-0 ps-2 form-control"
            onChange={formik.handleChange}
            value={formik.values.message}
          />
          <button
            type="submit"
            disabled={isLoading || !formik.values.message.trim()}
            className="btn btn-group-vertical"
          >
            <ArrowRightSquare size={20} />
            <span className="visually-hidden">{t('Send')}</span>
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default MessageForm
