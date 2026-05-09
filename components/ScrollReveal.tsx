type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({
  children,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
