export function CubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 2l8 4.5v9L12 20.5 4 15.5v-9L12 2z" strokeWidth="1.5" />
      <path d="M12 2v18.5" strokeWidth="1.5" />
      <path d="M20 6.5l-8 4.5-8-4.5" strokeWidth="1.5" />
    </svg>
  );
}

export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path d="M12 7v6l4 2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}


