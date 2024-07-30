import './index.css'
import React from 'react'
import App from './App.jsx'
import Loader from './app/loader.jsx'
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoutes from './protectedRoutes.jsx'

// lazy-load components
const LoginPage = React.lazy(() => import('./app/auth/login/index.jsx'))

// Home Components
import Home from './app/home/index.jsx'
const Customize = React.lazy(() => import('./app/customize/index.jsx'))
const ThemeOptions = React.lazy(() =>
  import('./app/customize/components/themes/ThemeOptions.jsx')
)

// Products Components
const ProductSection = React.lazy(() => import('./app/products/index.jsx'))

// Collection CRUDs
import AddCollection from './app/products/components/addCollection/addCollection.jsx'
const AddBulkCollection = React.lazy(() =>
  import('./app/products/components/addBulkCollection/addBulkCollection.jsx')
)

// Product CRUDs
import AddProduct from './app/products/components/addProduct/index.jsx'
import EditBulkPrice from './app/products/components/editBulkPrice/index.jsx'
const AddBulkProduct = React.lazy(() =>
  import('./app/products/components/addBulkProduct/addBulkProduct.jsx')
)

// Orders Components
const Orders = React.lazy(() => import('./app/orders/index.jsx'))
const OrderDetails = React.lazy(() =>
  import('./app/orders/components/orderDetails/index.jsx')
)

// Customers Components
const Customers = React.lazy(() => import('./app/customers/customers.jsx'))

// Reports Components
const Reports = React.lazy(() => import('./app/reports/index.jsx'))

// Settings Components
const Settings = React.lazy(() => import('./app/settings/index.jsx'))

const Messages = React.lazy(() => import('./app/messageSettings/index.jsx'))
import {
  ADD_PRODUCT_ACTION_TYPE,
  DETAILS_PRODUCT_ACTION_TYPE,
  EDIT_PRODUCT_ACTION_TYPE,
} from './app/staticData/constantActions.js'

const ErrorBoundary = React.lazy(() =>
  import('./errorBoundary/errorBoundary.jsx')
)

// Define routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <App />
      </ProtectedRoutes>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <React.Suspense fallback={<Loader />}>
            <Home />
          </React.Suspense>
        ),
      },
      {
        path: '/products',
        element: (
          <React.Suspense fallback={<Loader />}>
            <ProductSection />
          </React.Suspense>
        ),
      },
      {
        path: '/products/:categoryID',
        element: (
          <React.Suspense fallback={<Loader />}>
            <ProductSection />
          </React.Suspense>
        ),
      },

      {
        path: '/products/:categoryID/Add-collection',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddCollection />
          </React.Suspense>
        ),
      },
      {
        path: '/products/:categoryID/Add-bulk-collection',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddBulkCollection />
          </React.Suspense>
        ),
      },
      {
        path: '/products/:categoryID/edit-product',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddProduct action={EDIT_PRODUCT_ACTION_TYPE} />
          </React.Suspense>
        ),
        children: [
          {
            path: '/products/:categoryID/edit-product/:productID',
            element: (
              <React.Suspense fallback={<Loader />}>
                <AddProduct action={EDIT_PRODUCT_ACTION_TYPE} />
              </React.Suspense>
            ),
          },
        ],
      },

      {
        path: '/products/:categoryID/details',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddProduct action={DETAILS_PRODUCT_ACTION_TYPE} />
          </React.Suspense>
        ),
        children: [
          {
            path: '/products/:categoryID/details/:productID',
            element: (
              <React.Suspense fallback={<Loader />}>
                <AddProduct action={DETAILS_PRODUCT_ACTION_TYPE} />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: '/products/:categoryID/add-product',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddProduct action={ADD_PRODUCT_ACTION_TYPE} />
          </React.Suspense>
        ),
      },
      {
        path: '/products/:categoryID/add-bulk-product',
        element: (
          <React.Suspense fallback={<Loader />}>
            <AddBulkProduct />
          </React.Suspense>
        ),
      },

      {
        path: '/products/edit-bulk-price',
        element: <EditBulkPrice />,
      },

      // {
      //   path: '/orders',
      //   errorElement: <ErrorBoundary />,
      //   element: (
      //     <React.Suspense fallback={<Loader />}>
      //       <Orders />
      //     </React.Suspense>
      //   ),
      // },
      // {
      //   path: '/orders/:orderID',
      //   errorElement: <ErrorBoundary />,
      //   element: (
      //     <React.Suspense fallback={<Loader />}>
      //       <OrderDetails />
      //     </React.Suspense>
      //   ),
      // },
      {
        path: '/theme/list',
        element: (
          <React.Suspense fallback={<Loader />}>
            <Customize />
          </React.Suspense>
        ),
      },
      {
        path: '/theme/:themeOption/:id?',
        element: (
          <React.Suspense fallback={<Loader />}>
            <ThemeOptions />
          </React.Suspense>
        ),
      },
      // {
      //   path: '/reports',
      //   errorElement: <ErrorBoundary />,
      //   element: (
      //     <React.Suspense fallback={<Loader />}>
      //       <Reports />
      //     </React.Suspense>
      //   ),
      // },
      // {
      //   path: '/customers',
      //   errorElement: <ErrorBoundary />,
      //   element: (
      //     <React.Suspense fallback={<Loader />}>
      //       <Customers />
      //     </React.Suspense>
      //   ),
      // },
      {
        path: '/settings',
        errorElement: <ErrorBoundary />,
        element: (
          <React.Suspense fallback={<Loader />}>
            <Settings />
          </React.Suspense>
        ),
      },
      // {
      //   path: '/messages',
      //   element: (
      //     <React.Suspense fallback={<Loader />}>
      //       <Messages />
      //     </React.Suspense>
      //   ),
      // },
    ],
  },
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<Loader />}>
        <LoginPage />
      </React.Suspense>
    ),
  },
])
