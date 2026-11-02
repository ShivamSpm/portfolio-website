// Renders `text` with the `accent` substring in accent italic (the plan's "titleAccent").
export function AccentTitle({ text, accent }: { text: string; accent?: string }) {
  const i = accent ? text.indexOf(accent) : -1;
  if (!accent || i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em className="text-accent italic">{accent}</em>
      {text.slice(i + accent.length)}
    </>
  );
}
