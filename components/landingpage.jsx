'use client'
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../app/context/AuthContext"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const languages = {
  en: "English",
  fr: "Français",
  de: "Deutsch"
}

export default function Landingpage() {
    const { user, googleSignIn, logOut, lang, updateUserLanguage } = useAuth()
    const router = useRouter()

    const handleSignIn = async () => {
        try {
            await googleSignIn()
        } catch (error) {
            console.log(error)
        }
    }

    const handleSignOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error)
        }
    }

    const handleStartChat = () => {
        router.push(`/chat?lang=${lang}`)
    }

    const handleLanguageSelect = async (newLang) => {
        if (newLang !== lang && user) {
            await updateUserLanguage(user.uid, newLang)
        }
    }

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Sreeram Bangaru Info Chatbot
                </h1>
                {user ? (
                    <>
                        <div className="mt-2 text-lg text-muted-foreground">Welcome {user.displayName}!</div>
                        <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center items-center">
                            <Button
                                onClick={handleStartChat}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                            >
                                Chat ({languages[lang]})
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                        <LanguageIcon className="mr-2 h-4 w-4" />
                                        Change Language
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.entries(languages).map(([key, value]) => (
                                        <DropdownMenuItem key={key} onClick={() => handleLanguageSelect(key)}>
                                            {value}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Signout
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row justify-center">
                        <Button
                            onClick={handleSignIn}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
                        >
                            Continue with Google
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function LanguageIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 8 6 6" />
            <path d="m4 14 6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="m22 22-5-10-5 10" />
            <path d="M14 18h6" />
        </svg>
    )
}