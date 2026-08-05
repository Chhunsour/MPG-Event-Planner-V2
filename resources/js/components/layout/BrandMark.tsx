export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/mpg-favicon.png"
      alt="MPG"
      width={32}
      height={32}
      className={className}
      loading="eager"
    />
  );
}
