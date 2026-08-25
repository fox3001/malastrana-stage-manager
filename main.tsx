import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import './styles.css'

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
