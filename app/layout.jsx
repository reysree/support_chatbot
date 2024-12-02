// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
'use client'
import Landingpage from '@/components/landingpage'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
// import {
//   ClerkProvider,
//   SignInButton,
//   SignedIn,
//   SignedOut,
//   UserButton
// } from '@clerk/nextjs'
import {AuthContextProvider} from "./context/AuthContext"

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

// export default function Layout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body
//           className={cn(
//             'antialiased',
//             fontHeading.variable,
//             fontBody.variable
//           )}
//         >
//           <SignedOut>
//             <SignInButton />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//           {children}
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
          {children}
      </body>
    </html>
    </AuthContextProvider>
  )
}