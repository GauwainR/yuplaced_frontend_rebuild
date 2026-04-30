type YunotePlaceholderPageProps = {
  title: string;
};

export function YunotePlaceholderPage({ title }: YunotePlaceholderPageProps) {
  return (
    <div className="yn-placeholder">
      <div className="yn-placeholder-eyebrow">STEP 3.1</div>
      <h1>{title}</h1>
      <p>
        This section is intentionally left as a React shell placeholder.
        It will be migrated in the next steps without touching the visual system.
      </p>
    </div>
  );
}
