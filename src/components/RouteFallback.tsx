/** Lightweight shell while a lazy route chunk loads */
const RouteFallback = () => (
  <div className="min-h-[50vh] pt-24 flex items-center justify-center" aria-busy="true">
    <p className="text-muted-foreground font-body text-sm animate-pulse">Loading…</p>
  </div>
);

export default RouteFallback;
