import { useEffect } from 'react'
import { useFormik } from 'formik'
import FormContainer from './FormContainer'
import { Stack, FloatingLabel, Form, Button } from 'react-bootstrap'
import { loginUser } from '../slices/authUserSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const error = useSelector(state => state.user.error)
  const isLoggedIn = useSelector(state => state.user.isAuthenticated)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const validationSchema = Yup.object().shape({
    username: Yup.string().trim()
      .min(3, 'From 3 to 20 characters')
      .max(20, 'From 3 to 20 characters')
      .required('Required field'),
    password: Yup.string().trim()
      .required('Required field'),
  })

  const handleSubmit = ({ username, password }) => {
    dispatch(loginUser({ username, password }))
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <FormContainer image="imagelogin.png" imageAlt={t('Login')} regfooter={true}>
      <Form onSubmit={formik.handleSubmit}>
        <h1 className="text-center mb-4">{t('Login')}</h1>
        <Stack gap={3}>
          <FloatingLabel controlId="floatingUsername" label={t('Your nickname')} className="position-relative">
            <Form.Control
              autoFocus
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              placeholder={t('Your nickname')}
              name="username"
              autoComplete="username"
              isInvalid={!!(error) || (formik.touched.username && formik.errors.username)}
            />
            {formik.errors.username && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(formik.errors.username)}
              </Form.Control.Feedback>
            )}
            {!!(error) && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(error)}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label={t('Password')} className="mb-4">
            <Form.Control
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder={t('Password')}
              name="password"
              autoComplete="current-password"
              isInvalid={!!(error) || (formik.touched.password && formik.errors.password)}
            />
            {formik.errors.password && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(formik.errors.password)}
              </Form.Control.Feedback>
            )}
            {!!(error) && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(error)}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Stack>
        <Button type="submit" variant="outline-primary" className="w-100 mb-3 btn btn-outline-primary">{t('Login')}</Button>
      </Form>
    </FormContainer>
  )
}

export default Login
