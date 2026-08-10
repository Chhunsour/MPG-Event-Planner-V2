import Image from 'next/image';

type SiteImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function SiteImage({ src, alt, className, priority = false }: SiteImageProps) {
  if (!src) {
    return <div className={className ?? 'min-h-64 bg-[var(--paper-tint)]'} aria-label={alt} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className ?? 'object-cover'}
    />
  );
}

