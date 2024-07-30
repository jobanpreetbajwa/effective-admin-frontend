import './index.css'
import { Toaster } from 'sonner'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes.jsx'
import { StoreProvider } from './store/store.jsx'

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<>
		<StoreProvider>
			<Toaster richColors position='top-right' duration={1000} />
			<RouterProvider router={router} />
		</StoreProvider>
	</>
)
