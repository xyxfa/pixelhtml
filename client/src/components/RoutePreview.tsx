export default function RoutePreview({ title }: { title: string }) {
  return (
    <section className="route-map" aria-label={title}>
      <div className="route-map-island">
        <div className="route-map-node">
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  );
}
