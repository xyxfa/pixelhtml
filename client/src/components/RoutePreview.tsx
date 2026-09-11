export default function RoutePreview({ title }: { title: string }) {
  return (
    <section className="route-map" aria-label="通往 GameJam 作品的浮岛路线">
      <div className="route-map-island">
        <div className="route-map-node">
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  );
}
