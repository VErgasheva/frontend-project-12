import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)

  if (isAuthenticated) {
    return <Outlet />
  }
  else
  {
    return <Navigate to="/login" />
  }
}

export default PrivateRoute
