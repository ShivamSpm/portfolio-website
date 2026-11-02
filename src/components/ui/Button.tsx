import Link from "next/link";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors";

const variants = {
  primary: "bg-accent text-bg hover:bg-ink",
  secondary: "border border-line text-ink hover:border-ink",
};

type Props = {
  href: string;
  variant?: keyof typeof variants;
  external?: boolean;
  children: React.ReactNode;
};

// A link styled as a button. External links open in a new tab.
export function ButtonLink({ href, variant = "primary", external, children }: Props) {
  const className = `${base} ${variants[variant]}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
