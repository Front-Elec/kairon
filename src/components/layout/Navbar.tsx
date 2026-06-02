import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  /**
   * useMemo: el array de enlaces es un valor derivado estático.
   * Sin memo, React recrearía el array en cada render del Navbar,
   * lo que generaría referencias nuevas innecesarias.
   */
  const navLinks = useMemo(
    () => [
      { to: '/',      label: 'Catálogo'      },
      { to: '/loans', label: 'Préstamos'     },
      { to: '/admin', label: 'Admin'         },
      { to: '/stats', label: 'Estadísticas'  },
    ],
    [] // sin dependencias: los enlaces son constantes
  );

  return (
    <nav className="bg-white border-b border-secondary/10 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Kairon</span>
        </div>

        <div className="flex gap-6">
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
      </div>
    </nav>
  );
};
