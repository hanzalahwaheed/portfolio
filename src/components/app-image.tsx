import type { CSSProperties, ImgHTMLAttributes } from "react"

interface AppImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string
  fill?: boolean
  priority?: boolean
  width?: number
  height?: number
}

export default function Image({
  src,
  fill,
  priority = false,
  loading,
  fetchPriority,
  decoding = "async",
  width,
  height,
  className = "",
  style,
  ...props
}: AppImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : style

  return (
    <img
      loading={priority ? "eager" : (loading ?? "lazy")}
      fetchPriority={priority ? "high" : fetchPriority}
      decoding={decoding}
      src={src}
      width={width}
      height={height}
      className={className}
      style={fillStyle}
      {...props}
    />
  )
}
