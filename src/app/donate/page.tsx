"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { addDays, subYears, isBefore } from 'date-fns';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Heart } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppContext } from "@/context/AppContext";
import type { Donor } from "@/lib/data";
import { sendDonorConfirmationEmail } from "@/ai/flows/send-email-flow";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(18, "You must be at least 18 years old.").max(65, "You must be at most 65 years old."),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address."),
  location: z.string().min(5, "Location must be at least 5 characters."),
  lastDonationDate: z.date({
    required_error: "Your last donation date is required.",
  }),
}).refine(data => data.age >= 18, {
  message: "You must be at least 18 years old to donate.",
  path: ["age"],
}).refine(data => isBefore(data.lastDonationDate, addDays(new Date(), -56)), {
  message: "You must wait at least 56 days between donations.",
  path: ["lastDonationDate"],
});

export default function DonatePage() {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const { addDonor } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 18,
      phone: "",
      email: "",
      location: "",
      lastDonationDate: subYears(new Date(), 1)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const canDonate = values.age >= 18 && values.age <= 65 && isBefore(values.lastDonationDate, addDays(new Date(), -56));
    setIsEligible(canDonate);

    if (canDonate) {
      const newDonor: Omit<Donor, 'id'> = {
        name: values.name,
        bloodGroup: values.bloodGroup,
        lastDonation: format(values.lastDonationDate, "yyyy-MM-dd"),
        email: values.email,
        phone: values.phone,
      };
      addDonor(newDonor);

      try {
        await sendDonorConfirmationEmail({name: values.name, email: values.email});
        toast({
          title: "Registration Successful!",
          description: `Thank you, ${values.name}. Your submission has been received.`,
          variant: "default"
        })
      } catch (error) {
         toast({
          title: "Registration Successful!",
          description: `Thank you, ${values.name}. Your donation form has been submitted. We will contact you shortly.`,
          variant: "default"
        })
      }
      
      form.reset();
    } else {
       toast({
        title: "Not Eligible to Donate",
        description: "Based on the information provided, you are not currently eligible to donate blood.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tight font-headline">Become a Donor</CardTitle>
            <CardDescription className="text-lg">Your contribution can save lives. Please fill out the form below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your gender" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your blood group" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                 <div className="grid md:grid-cols-2 gap-8">
                   <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input placeholder="donor@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location / City</FormLabel>
                      <FormControl><Input placeholder="e.g., New York, NY" {...field} /></FormControl>
                      <FormDescription>We will use this to find nearby donation centers.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastDonationDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Donation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>If you have never donated, please select a date more than 2 months ago.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                <Button type="submit" size="lg" className="w-full">Check Eligibility & Submit</Button>
              </form>
            </Form>
             {isEligible !== null && (
              <Alert className="mt-8" variant={isEligible ? "default" : "destructive"}>
                <AlertTitle>{isEligible ? "Congratulations! You are eligible." : "We're sorry, you are not eligible."}</AlertTitle>
                <AlertDescription>
                  {isEligible
                    ? "Thank you for your willingness to donate. Your form has been submitted and we will be in touch."
                    : "Based on the details provided, you do not meet the current criteria (e.g., age 18-65, 56-day gap between donations)."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
