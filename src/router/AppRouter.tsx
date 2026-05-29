import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { CatalogPage } from '../pages/CatalogPage';
import { BookDetailPage } from '../pages/BookDetailPage';
import { LoansPage } from '../pages/LoansPage';
import { AdminPage } from '../pages/AdminPage';
import { StatsPage } from '../pages/StatsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

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
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: "books/:id", element: <BookDetailPage /> },
      { path: "loans", element: <LoansPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "stats", element: <StatsPage /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
