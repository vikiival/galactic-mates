"use client"

import { useState } from "react"
import { Button } from "~/components/ui/Button"
import { Slider } from "~/components/ui/slider"
// import Image from "next/image"
import { Card, CardContent } from "~/components/ui/card"
import ChatWindow from "./ChatWindow"
// import { SignIn } from "./SignIn"
// import { useSession } from "next-auth/react"

// eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-explicit-any
const Image = (props: any) => <img {...props} />

export default function PersonalityAnalyzer({ seed }: { seed: number }) {
  const [step, setStep] = useState(1)
  const [lonelinessValue, setLonelinessValue] = useState(50)
  const [showChat, setShowChat] = useState(false)

  const getPersonalityType = () => {
    if (lonelinessValue < 25) {
      return {
        type: "Luminaria",
        description:
          "Luminaria is a beacon of hope and optimism, radiating warmth and kindness wherever they go. With a heart full of compassion and a mind full of curiosity, they are always eager to help others and make a positive impact on their lives.",
        image: "https://replicate.delivery/xezq/uErbZBJeiSUZIyhnMtyTV707fCY9cydpadpBFiia1fcLFcooA/out-0.webp",
      }
    } else if (lonelinessValue < 51) {
      return {
        type: "The Wanderer",
        description:
          "The Wanderer is a free spirit who's still finding their way in life. They're often lost in thought, wondering what could've been if they'd taken a different path. They're friendly and approachable, but can be a bit introverted at times, needing some alone time to recharge.",
        image: "/placeholder.svg?height=400&width=400",
      }
    } else if (lonelinessValue < 75) {
      return {
        type: "Thoughtful Observer",
        description:
          "You prefer smaller, more intimate gatherings and meaningful conversations. You're selective about your social circle and value depth over breadth in relationships.",
        image: "/placeholder.svg?height=400&width=400",
      }
    } else {
      return {
        type: "Introspective Soloist",
        description:
          "You find peace and energy in solitude. Your rich inner world fuels your creativity and insights. While you may have fewer connections, they tend to be profound and long-lasting.",
        image: "/placeholder.svg?height=400&width=400",
      }
    }
  }

  const personality = getPersonalityType()

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const startChat = () => {
    setShowChat(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-6 flex flex-col h-[600px]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Personality Analyzer</h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>

          {step === 1 && (
            <div className="flex flex-col h-full">
              <div className="flex-grow space-y-4">
                <h2 className="text-xl font-semibold">How would you rate your loneliness?</h2>
                <div className="space-y-6">
                  <Slider
                    value={[lonelinessValue]}
                    onValueChange={(value) => setLonelinessValue(value[0])}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Very Social (0)</span>
                    <span>Very Lonely (100)</span>
                  </div>
                  <p className="text-center font-medium">Your value: {lonelinessValue}</p>
                </div>
                <div className="mt-2 bg-primary/10 rounded-lg">
                  <h2 className="text-xl font-semibold">Space gave you a lucky number today</h2>
                </div>
                <div className="mt-2 bg-primary/10 rounded-lg">
                <h3 className="text-2xl text-center font-bold text-primary">{seed}</h3>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full" onClick={handleNext}>
                  Analyze Your Personality
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full">
              <div className="flex-grow space-y-4 text-center">
                <h2 className="text-xl font-semibold">Your personality is close to</h2>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">{personality.type}</h3>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-primary">{personality.description}</h3>
                </div>
              </div>
              <div className="mt-auto pt-6 flex w-full">
                <Button variant="outline" onClick={handleBack} className="flex-1 mr-2">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 ml-2">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full">
              <div className="flex-grow space-y-4 text-center">
                <h2 className="text-xl font-semibold">If you vibes could be a picture</h2>
                <div className="flex justify-center">
                  <Image
                    src={personality.image || "/placeholder.svg"}
                    alt={personality.type}
                    width={300}
                    height={300}
                    className="rounded-lg border"
                  />
                </div>
              </div>
              <div className="mt-auto pt-6 flex w-full">
                <Button variant="outline" onClick={handleBack} className="flex-1 mr-2">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 ml-2">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 4 && !showChat && (
            <div className="flex flex-col h-full">
              <div className="flex-grow space-y-4">
                <h2 className="text-xl font-semibold text-center">TL;DR</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Image
                    src={personality.image || "/placeholder.svg"}
                    alt={personality.type}
                    width={120}
                    height={120}
                    className="rounded-lg border"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-primary">{personality.type}</h3>
                    <p className="text-muted-foreground">{personality.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6 space-y-4 w-full">
              <Button className="w-full" onClick={startChat}>
                  Chat with your Galaxy Mate
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  Mint Your Personality NFT
                </Button>
                <Button variant="outline" className="w-full" onClick={handleBack}>
                  Back
                </Button>
              </div>
            </div>
          )}
                    {showChat && <ChatWindow personalityType={personality.type} onClose={() => setShowChat(false)} />}
        </CardContent>
      </Card>
    </main>
  )
}

