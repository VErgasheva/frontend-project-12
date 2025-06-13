import { useEffect } from 'react'
import { useFormik } from 'formik'
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap'
import FormContainer from './FormContainer'
import * as Yup from 'yup'
import { registerUser } from '../slices/authUserSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const validationSchema = Yup.object().shape({
  username: Yup.string().trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string().trim()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
})

const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector(state => state.user.error)
  const isLoggedIn = useSelector(state => state.user.isAuthenticated)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = ({ username, password }) => {
    dispatch(registerUser({ username, password }))
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <FormContainer image="imagereg.png" imageAlt={t('Registration')} regfooter={false}>
      <Form className="w-100 mx-auto" onSubmit={formik.handleSubmit}>
        <h1 className="text-center mb-4">{t('Registration')}</h1>
        <fieldset disabled={formik.isSubmitting}>
          <Stack gap={3}>
            <FloatingLabel controlId="floatingUsername" label={t('Username')} className="position-relative">
              <Form.Control
                autoFocus
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder={t('Username')}
                name="username"
                autoComplete="username"
                isInvalid={!!(error) || (formik.touched.username && formik.errors.username)}
              />
              {error && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {t(error)}
                </Form.Control.Feedback>
              )}
              {formik.errors.username && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {t(formik.errors.username)}
                </Form.Control.Feedback>
              )}
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label={t('Password')}>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder={t('Password')}
                name="password"
                autoComplete="new-password"
                isInvalid={!!(error) || (formik.touched.password && formik.errors.password)}
              />
              {formik.errors.password && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {t(formik.errors.password)}
                </Form.Control.Feedback>
              )}
            </FloatingLabel>
            <FloatingLabel controlId="floatingPasswordConfirmation" label={t('Confirm the password')}>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.passwordConfirmation}
                placeholder={t('Confirm the password')}
                name="passwordConfirmation"
                autoComplete="new-password"
                isInvalid={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
              />
              {formik.errors.passwordConfirmation && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {t(formik.errors.passwordConfirmation)}
                </Form.Control.Feedback>
              )}
            </FloatingLabel>
            <Button type="submit" variant="outline-primary">{t('Register')}</Button>
          </Stack>
        </fieldset>
      </Form>
    </FormContainer>
  )
}

export default SignupPage