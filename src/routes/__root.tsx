import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import appCss from "../styles.css?url"
import { heroInitScript, heroStyles } from "@/lib/hero-themes"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hanzalah Waheed" },
      { name: "description", content: "Software engineer. Portfolio, builds, and writing by Hanzalah Waheed." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: Outlet,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!import.meta.env.PROD) return

    import("@microsoft/clarity")
      .then(({ default: Clarity }) => Clarity.init("yrxxrmd7uv"))
      .catch(error => console.warn("Clarity could not load", error))
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: heroInitScript }} />
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: heroStyles }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
