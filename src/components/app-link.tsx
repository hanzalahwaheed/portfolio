import { useRouter } from "@tanstack/react-router"
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react"

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string
  children: ReactNode
}

export default function Link({ href, children, onClick, target, ...props }: AppLinkProps) {
  const router = useRouter()
  const isInternal = href.startsWith("/")

  if (!isInternal) {
    return (
      <a href={href} target={target} {...props}>
        {children}
      </a>
    )
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== "_self")
    ) {
      return
    }

    event.preventDefault()
    router.navigate({ to: href } as never)
  }

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
