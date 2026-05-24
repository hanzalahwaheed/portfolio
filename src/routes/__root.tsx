import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import appCss from "../styles.css?url"
import { googleSans } from "@/lib/fonts"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "hanzlahwaheed" },
      { name: "description", content: "Hanzlah Waheed Portfolio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "/" },
    ],
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
