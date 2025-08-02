
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Droplet, Heart, Users, LifeBuoy, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const stats = [
  { icon: Heart, value: '12,000+', label: 'Lives Saved' },
  { icon: Droplet, value: '5,000+', label: 'Units Donated' },
  { icon: Users, value: '20,000+', label: 'Registered Donors' },
  { icon: LifeBuoy, value: '50+', label: 'Partner Hospitals' },
];

const carouselItems = [
  {
    title: 'Be a Hero, Donate Blood Today',
    description: 'Your single donation can save up to three lives. Join our community of heroes.',
    image: 'https://placehold.co/1200x600',
    dataAiHint: 'blood donation',
    cta: 'Donate Now',
    link: '/donate',
  },
  {
    title: 'Urgent Need for O-Negative Blood',
    description: 'Universal donors are in high demand. Check your eligibility and help us now.',
    image: 'https://placehold.co/1200x600',
    dataAiHint: 'medical checkup',
    cta: 'Check Eligibility',
    link: '/eligibility',
  },
  {
    title: 'Request Blood for a Loved One',
    description: 'In need of blood? Our portal connects you with willing donors in your area.',
    image: 'https://placehold.co/1200x600',
    dataAiHint: 'happy family',
    cta: 'Request Blood',
    link: '/request',
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <Carousel className="w-full" autoplayDelay={5000} opts={{loop: true}}>
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
                      <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                          {item.title}
                        </h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                          {item.description}
                        </p>
                        <Link href={item.link}>
                          <Button size="lg" className="mt-4" variant="default">
                            {item.cta} <Heart className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                        data-ai-hint={item.dataAiHint}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col items-center justify-center">
                    <stat.icon className="h-12 w-12 text-primary mb-4" />
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A simple three-step process to save lives.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-12 sm:grid-cols-3 sm:gap-16">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-bold">1. Check Eligibility</h3>
                <p className="text-sm text-muted-foreground">Answer a few simple questions to see if you're eligible to donate.</p>
                <Link href="/eligibility"><Button variant="link">Get Started</Button></Link>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-bold">2. Find a Center</h3>
                <p className="text-sm text-muted-foreground">Find a convenient donation center or blood drive near you.</p>
                <Link href="/directory"><Button variant="link">Find a Center</Button></Link>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Heart className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-bold">3. Donate & Save Lives</h3>
                <p className="text-sm text-muted-foreground">The actual donation process takes less than 15 minutes.</p>
                <Link href="/donate"><Button variant="link">Donate Now</Button></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
