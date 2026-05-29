import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { CatalogPage } from '../pages/CatalogPage';

const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50/50">
    <Navbar />
    <main className="max-w-7xl mx-auto w-full flex-grow p-4 md:p-8">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-secondary">Página no encontrada</p>
      </div>
    ),
    children: [
      { index: true, element: <CatalogPage /> },
      { path: "books/:id", element: <div className="p-8"><h1 className="text-2xl font-bold">Detalle del Libro</h1><p>Funcionalidad en desarrollo...</p></div> },
      { path: "loans", element: <div className="p-8"><h1 className="text-2xl font-bold">Historial de Préstamos</h1><p>Funcionalidad en desarrollo...</p></div> },
      { path: "admin", element: <div className="p-8"><h1 className="text-2xl font-bold">Panel Administrativo</h1><p>Funcionalidad en desarrollo...</p></div> },
      { path: "stats", element: <div className="p-8"><h1 className="text-2xl font-bold">Estadísticas</h1><p>Funcionalidad en desarrollo...</p></div> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
