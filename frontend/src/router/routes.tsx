import { lazy, type ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

interface RouteObject {
  path: string;
  element: ReactNode;
}

interface RoutesMap {
  expense: RouteObject[];
  default: RouteObject[];
}

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

const Customer = lazy(() => import('@/pages/Customer'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));

const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));

// @ts-ignore — Quote pages do not exist yet in the codebase
const Quote = lazy(() => import('@/pages/Quote'));
// @ts-ignore — Quote pages do not exist yet in the codebase
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
// @ts-ignore — Quote pages do not exist yet in the codebase
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
// @ts-ignore — Quote pages do not exist yet in the codebase
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
// @ts-ignore — PaymentMode page does not exist yet in the codebase
const PaymentMode = lazy(() => import('@/pages/Payment/PaymentMode'));
// @ts-ignore — Taxes page does not exist yet in the codebase
const Taxes = lazy(() => import('@/pages/Taxes'));

const routes: RoutesMap = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/',
      element: <Invoice />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },

    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
