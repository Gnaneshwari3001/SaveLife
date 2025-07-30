import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function FloatingDonateButton() {
  return (
    <Link href="/donate" className="fixed bottom-6 right-6 z-50">
      <Button size="lg" className="rounded-full shadow-lg" variant="default">
        <Heart className="mr-2 h-5 w-5" />
        Donate Now
      </Button>
    </Link>
  )
}
