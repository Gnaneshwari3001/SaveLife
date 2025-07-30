import Image from "next/image"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Heart, Shield } from "lucide-react"

const testimonials = [
  {
    name: "John Doe",
    role: "Donor",
    avatar: "https://placehold.co/100x100",
    dataAiHint: "man smiling",
    quote: "The process was so simple and quick. It feels amazing to know I've helped save a life. The LifeStream team made it effortless."
  },
  {
    name: "Jane Smith",
    role: "Recipient's Family",
    avatar: "https://placehold.co/100x100",
    dataAiHint: "woman portrait",
    quote: "When my son needed an urgent transfusion, LifeStream Portal was a beacon of hope. We found a matching donor within hours. We are forever grateful."
  },
  {
    name: "Dr. Emily White",
    role: "Partner Hospital",
    avatar: "https://placehold.co/100x100",
    dataAiHint: "doctor friendly",
    quote: "This portal has streamlined our blood sourcing process significantly. It's a vital tool that connects us to the community and saves precious time."
  }
]

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <div className="grid gap-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">About LifeStream Portal</h1>
            <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
              Connecting blood donors with recipients to create a lifeline for those in need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Image
              src="https://placehold.co/600x400"
              alt="Group of volunteers"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              data-ai-hint="diverse volunteers"
            />
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Heart className="text-primary"/> Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">To create a seamless and efficient network that bridges the gap between blood donors and patients, ensuring timely access to safe blood and saving lives through technology and community engagement.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A future where no life is lost due to a shortage of blood. We envision a proactive community of donors, ready to help at a moment's notice, supported by a robust and accessible platform.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Our Impact</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">We are proud of the community we have built and the lives we have touched.</p>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Timely Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Reduced average time to find a donor by 75% in our partner regions.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Increased Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Facilitated a 40% increase in first-time donors through awareness campaigns.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Community Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Over 20,000 registered users committed to the cause of saving lives.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">What People Say</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
