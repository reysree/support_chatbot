// components/chatbot.jsx
"use client"
import { useState, useEffect, useRef } from "react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactMarkdown from 'react-markdown'
import { useAuth } from "../app/context/AuthContext"
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

// const initialMessages = {
//   en: "Hi, I am the Headstarter support assistant. How can I help you?",
//   fr: "Bonjour, je suis l'assistant de support Headstarter. Comment puis-je vous aider ?",
//   de: "Hallo, ich bin der Headstarter-Support-Assistent. Wie kann ich Ihnen helfen?"
// }

const getInitialMessage = (lang, userName) => {
  const messages = {
    en: `Hi ${userName}, I am the Sreeram Bangaru Information Assistant. How can I help you?`,
    fr: `Bonjour ${userName}, Je suis l'assistant d'information Sreeram. Comment puis-je t'aider?`,
    de: `Hallo ${userName}, Ich bin der Informationsassistent von Sameer. Wie kann ich dir helfen?`
  }
  return messages[lang] || messages.en
}


export function Chatbot() {
  const chatContentRef = useRef(null);
  const router = useRouter();
  const { user, logOut, lang, updateUserLanguage } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (user) {
      const userName = user.displayName || 'there' // Fallback to 'there' if displayName is not available
      const initialMessage = getInitialMessage(lang, userName)
      setMessages([{ role: "assistant", content: initialMessage }]);
    }
  }, [lang, user]);


  const handleClearChat = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  const handleSignOut = async () => {
    try {
        await logOut()
        router.push('/')
    } catch (error) {
        console.log(error)
    }
  }

  const handleLanguageChange = async (newLang) => {
    if (user) {
      await updateUserLanguage(user.uid, newLang);
      const userName = user.displayName || 'there'
      const newInitialMessage = getInitialMessage(newLang, userName)
      setMessages([{ role: "assistant", content: newInitialMessage }]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: "user", content: input.trim() };
      setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
      setInput("");

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [...messages, userMessage], language: lang }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response from the server');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }
          const text = decoder.decode(value || new Uint8Array(), { stream: true });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);

            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text }
            ];
          });
          return reader.read().then(processText);
        });
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev.slice(0, prev.length - 1),
          { role: "assistant", content: "I'm sorry, I encountered an error. Please try again later." }
        ]);
      }
    }
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-10 md:w-10"
                  prefetch={false}
                >
                  {user && user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10" />
                  )}
                  <span className="sr-only">Profile</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Link 
                    href="#" 
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                    >
                      <LanguageIcon className="h-5 w-5" />
                      <span className="sr-only">Change Language</span>
                    </Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>French</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("de")}>German</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">Change Language</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href='#'
                  onClick={handleSignOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <Card className="w-full max-w-md h-[700px] flex flex-col">
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">AI Assistant</p>
              <p className="text-sm text-muted-foreground">Headstarter Support ({lang})</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="icon" variant="outline" className="rounded-full" onClick={handleClearChat}>
              <TrashIcon className="w-4 h-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent ref={chatContentRef} className="flex-grow overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                message.role === "assistant" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" size="icon">
              <SendIcon className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
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

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function UserIcon(props) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function SendIcon(props) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}