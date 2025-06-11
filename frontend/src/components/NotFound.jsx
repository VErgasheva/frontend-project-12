import { Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <Image
        src="image.svg"
        alt={t('Page not found')}
        fluid
        className="h-25"
      />
      <h1 className="h4 text-muted">{t('Page not found')}</h1>
      <p className="text-muted">
        <span>{t('But you can go ')}</span>
        <Link to="/">{t('to the main page')}</Link>
      </p>
    </div>
  )
}

export default NotFound
