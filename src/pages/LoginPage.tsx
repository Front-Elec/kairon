import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/ui/PageLoader';
import { Eye, EyeOff } from 'lucide-react';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname || '/';

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = login(username.trim(), password);

    if (!isValid) {
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      return;
    }

    setError('');
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">K</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">Karin</p>
          <CardTitle>Ingresar</CardTitle>
          <p className="text-sm text-secondary">
            Accede a tu espacio en la biblioteca digital.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1">
                  Credenciales de prueba
                </p>

                <p>
                  <span className="font-medium">Admin:</span> admin@kairon.com / admin123
                </p>

                <p>
                  <span className="font-medium">Usuario 1:</span> usuario1@kairon.com /
                  usuario123
                </p>

                <p>
                  <span className="font-medium">Usuario 2:</span> usuario2@kairon.com /
                  usuario123
                </p>
              </div>

              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Correo
              </label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ingresa tu correo"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-secondary transition-colors hover:text-primary"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full">
              ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
