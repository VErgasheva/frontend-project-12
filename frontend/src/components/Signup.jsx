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
  const authError = useSelector(state => state.user.error)
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)

  if (isAuthenticated) {
    navigate('/')
  }

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
    <FormContainer image="imagereg.png" imageAlt="Регистрация" regfooter={false}>
      <Form className="w-100 mx-auto" onSubmit={formik.handleSubmit}>
        <h1 className="text-center mb-4">Регистрация</h1>
        <fieldset disabled={formik.isSubmitting}>
          <Stack gap={3}>
            <FloatingLabel controlId="floatingUsername" label="Имя пользователя" className="position-relative">
              <Form.Control
                autoFocus
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder="Имя пользователя"
                name="username"
                autoComplete="username"
                isInvalid={!!authError || (formik.touched.username && formik.errors.username)}
              />
              {authError && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {t(authError)}
                </Form.Control.Feedback>
              )}
              {formik.errors.username && (
                <Form.Control.Feedback type="invalid" tooltip>
                  {formik.errors.username}
                </Form.Control.Feedback>
              )}
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Пароль">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Пароль"
                name="password"
                autoComplete="current-password"
                isInvalid={!!authError || (formik.touched.password && formik.errors.password)}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors.password}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="floatingPasswordConfirmation" label="Подтвердите пароль">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.passwordConfirmation}
                placeholder="Подтвердите пароль"
                name="passwordConfirmation"
                autoComplete="current-passwordConfirmation"
                isInvalid={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors.passwordConfirmation}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button type="submit" variant="outline-primary">Зарегистрироваться</Button>
          </Stack>
        </fieldset>
      </Form>
    </FormContainer>
  )
}
export default SignupPage
