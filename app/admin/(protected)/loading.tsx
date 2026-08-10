export default function AdminLoading() {
  return (
    <section className="admin-loading" aria-label="Loading admin content" aria-busy="true">
      <div><span /><strong /><p /></div>
      <div className="admin-loading__grid">{Array.from({ length: 4 }, (_, index) => <span key={index} />)}</div>
      <div className="admin-loading__panel" />
    </section>
  );
}
