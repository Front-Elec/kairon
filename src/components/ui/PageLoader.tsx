/**
 * PageLoader — fallback de <Suspense> para code splitting.
 * Se muestra mientras Vite descarga el chunk de la página solicitada.
 */
export const PageLoader = () => {
  return (
    <div
      className="w-full flex items-center justify-center py-20"
      role="status"
      aria-label="Cargando página"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-secondary">Cargando...</span>
      </div>
    </div>
  );
};

export default PageLoader;
