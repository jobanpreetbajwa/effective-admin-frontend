import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ProtectedRoutes component
const ProtectedRoutes = ({ children }) => {
	const navigate = useNavigate()

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			console.log('Token does not exist in local storage.')
			navigate('/login')
		}
	}, [navigate])

	return children
}

export default ProtectedRoutes
