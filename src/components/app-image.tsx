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
  priority: _priority,
  width,
  height,
  className = "",
  style,
  ...props
}: AppImageProps) {
  void _priority

  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : style

  return <img src={src} width={width} height={height} className={className} style={fillStyle} {...props} />
}
