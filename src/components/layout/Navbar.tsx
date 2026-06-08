import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);

  const navLinks = useMemo(
    () => {
      const commonLinks = [
        { to: '/', label: 'Catálogo' },
      ];

      if (session?.role === 'usuario') {
        return [
          ...commonLinks,
          { to: '/my-loans', label: 'Libros solicitados' },
        ];
      }

      if (session?.role === 'admin') {
        return [
          ...commonLinks,
          { to: '/loans', label: 'Préstamos' },
          { to: '/admin', label: 'Admin' },
          { to: '/stats', label: 'Estadísticas' },
        ];
      }

      return commonLinks;
    },
    [session?.role]
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-white border-b border-secondary/10 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          {session ? (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">{session.username}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {session.role}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">Kairon</span>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {session ? (
            <div className="flex items-center gap-3 sm:justify-end">
              <Button type="button" variant="secondary" onClick={handleLogout} className="text-sm">
                Cerrar sesión
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
