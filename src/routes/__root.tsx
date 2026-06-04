import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import appCss from "../styles.css?url"
import { googleSans } from "@/lib/fonts"

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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className={`font-sans antialiased ${googleSans.variable}`}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
