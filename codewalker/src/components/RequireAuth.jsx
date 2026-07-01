import { Navigate } from 'react-router-dom'

function RequireAuth({ children }) {
  const isAuthenticated = localStorage.getItem('codewalker_admin_auth') === 'authenticated'

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default RequireAuth
