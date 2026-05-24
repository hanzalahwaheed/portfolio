import Image from "@/components/app-image"

interface BackgroundImageProps {
  src: string
  alt?: string
  opacity?: number
  className?: string
  priority?: boolean
}

const BackgroundImage = ({
  src,
  alt = "Background",
  opacity = 100,
  className = "",
  priority = false,
}: BackgroundImageProps) => {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Image src={src} alt={alt} fill className={`object-cover opacity-${opacity}`} priority={priority} />
    </div>
  )
}

export default BackgroundImage
