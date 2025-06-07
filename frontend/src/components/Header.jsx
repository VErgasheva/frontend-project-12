import { Navbar, Container, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { actions as userActions } from '../slices/authUserSlice.js'

function Header() {
  const dispatch = useDispatch()
  const showLogout = useSelector(state => state.user.isAuthenticated)
  const LogoutButton = () => {
    return showLogout && (
      <Button
        className="btn btn-primary"
        onClick={() => {
          dispatch(userActions.logout())
        }}
      >
        Выйти
      </Button>
    )
  }
  return (
    <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
      <Container>
        <Navbar.Brand href="/">ChatApp</Navbar.Brand>
        <LogoutButton />
      </Container>
    </Navbar>
  )
}

export default Header
