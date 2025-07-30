"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { LifeBuoy } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { mockRequests } from "@/lib/data"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1 unit."),
  urgency: z.enum(["Urgent", "Standard", "Within a Week"]),
  hospitalName: z.string().min(3, "Hospital name is required."),
  contactNumber: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address."),
  city: z.string().min(2, "City is required."),
});

export default function RequestPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      hospitalName: "",
      contactNumber: "",
      email: "",
      city: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRequest = {
        id: `R${String(mockRequests.length + 1).padStart(3, '0')}`,
        patientName: values.name,
        bloodGroup: values.bloodGroup,
        units: values.quantity,
        hospital: values.hospitalName,
        status: 'Pending',
        urgency: values.urgency as 'Urgent' | 'Standard' | 'Within a Week',
    };
    mockRequests.push(newRequest);
    
    console.log(values)
    toast({
      title: "Request Submitted Successfully!",
      description: `Your request for ${values.quantity} unit(s) of ${values.bloodGroup} blood has been broadcasted. We will notify you when a donor is found.`,
      variant: "default",
    })
    form.reset();
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tight font-headline">Request Blood</CardTitle>
            <CardDescription className="text-lg">In need of blood? Fill out the form to reach our network of donors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient's Full Name</FormLabel>
                      <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group Required</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
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
                   <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (in units)</FormLabel>
                      <FormControl><Input type="number" placeholder="2" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="urgency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Urgent">Urgent (Within 24 hours)</SelectItem>
                          <SelectItem value="Standard">Standard (Within 2-3 days)</SelectItem>
                          <SelectItem value="Within a Week">Within a Week</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="hospitalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name & Address</FormLabel>
                      <FormControl><Input placeholder="City General Hospital, 123 Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                 <div className="grid md:grid-cols-2 gap-8">
                   <FormField control={form.control} name="contactNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                        <FormDescription>Your contact for coordination.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email Address</FormLabel>
                        <FormControl><Input placeholder="contact@example.com" {...field} /></FormControl>
                        <FormDescription>We will send updates to this email.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="e.g., Los Angeles" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <Button type="submit" size="lg" className="w-full">Submit Request</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
