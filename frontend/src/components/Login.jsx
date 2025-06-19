import { useFormik } from 'formik'
import FormContainer from './FormContainer'
import { Stack, FloatingLabel, Form, Button, Alert } from 'react-bootstrap'
import { loginUser, actions as userActions } from '../slices/authUserSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import useAuthRedirect from '../hooks/useAuthRedirect'

function Login() {
  useAuthRedirect()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const error = useSelector(state => state.user.error)
  const isLoggedIn = useSelector(state => state.user.isAuthenticated)

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

  const handleFieldChange = (e) => {
    if (error) {
      dispatch(userActions.logout())
    }
    formik.handleChange(e)
  }

  return (
    <FormContainer image="imagelogin.png" imageAlt={t('Login')} regfooter={true}>
      <Form onSubmit={formik.handleSubmit}>
        <h1 className="text-center mb-4">{t('Login')}</h1>
        {/* Глобальная ошибка авторизации */}
        {!!error && (
          <Alert variant="danger" className="mb-3" data-testid="auth-error">
            {t(error)}
          </Alert>
        )}
        <Stack gap={3}>
          <FloatingLabel controlId="floatingUsername" label={t('Your nickname')} className="position-relative">
            <Form.Control
              autoFocus
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              placeholder={t('Your nickname')}
              name="username"
              autoComplete="username"
              isInvalid={formik.touched.username && !!formik.errors.username}
            />
            {formik.errors.username && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(formik.errors.username)}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label={t('Password')} className="mb-4">
            <Form.Control
              type="password"
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
 value={formik.values.password}
              placeholder={t('Password')}
              name="password"
              autoComplete="password"
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            {formik.errors.password && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(formik.errors.password)}
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
