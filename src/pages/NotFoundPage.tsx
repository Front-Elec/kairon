import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-7xl font-bold tracking-tighter text-gray-900">404</h1>
        <p className="text-xl text-secondary">Vaya, parece que te has perdido en la biblioteca.</p>
        <p className="text-gray-500 max-w-md">La página que buscas no existe o ha sido movida a otra sección de nuestro archivo digital.</p>
      </div>
      <Button onClick={() => navigate('/')} className="px-8 py-3">
        Volver al Catálogo
      </Button>
    </div>
  );
};
