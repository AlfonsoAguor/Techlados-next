"use client"
/* Provider para el funcionamiente de nextAuth */

import { SessionProvider } from "next-auth/react"

interface Props {
    children: React.ReactNode
}

function Providers({children}: Props) {
  return <SessionProvider>{children}</SessionProvider>
}

export default Providers