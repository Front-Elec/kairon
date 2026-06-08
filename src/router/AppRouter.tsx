import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { PageLoader } from '../components/ui/PageLoader';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Cada página se carga como chunk separado (code splitting)
const CatalogPage = lazy(() =>
  import('../pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const BookDetailPage = lazy(() =>
  import('../pages/BookDetailPage').then((m) => ({ default: m.BookDetailPage }))
);
const LoansPage = lazy(() =>
  import('../pages/LoansPage').then((m) => ({ default: m.LoansPage }))
);
const MyLoansPage = lazy(() =>
  import('../pages/MyLoansPage').then((m) => ({ default: m.MyLoansPage }))
);
const AdminPage = lazy(() =>
  import('../pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const StatsPage = lazy(() =>
  import('../pages/StatsPage').then((m) => ({ default: m.StatsPage }))
);
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

/**
 * RootLayout envuelve todas las rutas hijas con un único <Suspense>.
 * De esta forma el PageLoader se muestra al navegar a cualquier ruta
 * sin necesidad de repetir <Suspense> en cada elemento de ruta.
 */
const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50/50">
    <Navbar />
    <main className="max-w-7xl mx-auto w-full flex-grow p-4 md:p-8">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
  </div>
);

const AuthLayout = () => (
  <Suspense fallback={<PageLoader />}>
    <Outlet />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    // NotFoundPage también es lazy; necesita su propio Suspense porque
    // el errorElement se renderiza fuera del árbol de RootLayout.
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
    children: [
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <CatalogPage /> },
          { path: 'books/:id', element: <BookDetailPage /> },
          { path: 'my-loans', element: <MyLoansPage /> },
          {
            element: <ProtectedRoute requiredRole="admin" />,
            children: [
              { path: 'loans', element: <LoansPage /> },
              { path: 'admin', element: <AdminPage /> },
              { path: 'stats', element: <StatsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
