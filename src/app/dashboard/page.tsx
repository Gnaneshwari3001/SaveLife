
"use client"

import { useEffect, useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useRouter }from "next/navigation";
import { Donor, Request } from '@/lib/data';
import { Droplet, Heart } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, donors, requests } = useAppContext();
  const router = useRouter();
  const [userDonations, setUserDonations] = useState<Donor[]>([]);
  const [userRequests, setUserRequests] = useState<Request[]>([]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/signin');
    } else {
      const filteredDonations = donors.filter(d => d.userId === currentUser.uid);
      const filteredRequests = requests.filter(r => r.userId === currentUser.uid);
      setUserDonations(filteredDonations);
      setUserRequests(filteredRequests);
    }
  }, [currentUser, donors, requests, router]);

  if (!currentUser) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Redirecting to sign in...</p>
        </div>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">My Dashboard</h1>
            <p className="text-muted-foreground md:text-xl">
                Welcome back, {currentUser.email}! Here's your activity on LifeStream Portal.
            </p>
        </div>

        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Droplet className="text-primary"/>My Donation History</CardTitle>
                    <CardDescription>A record of all your donation submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userDonations.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Blood Group</TableHead>
                                    <TableHead>Last Donation Date</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDonations.map((donation) => (
                                    <TableRow key={donation.id}>
                                        <TableCell className="font-medium">{donation.name}</TableCell>
                                        <TableCell>{donation.bloodGroup}</TableCell>
                                        <TableCell>{donation.lastDonation}</TableCell>
                                        <TableCell>{donation.email}</TableCell>
                                        <TableCell>{donation.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground">You have not made any donation submissions yet. <a href="/donate" className="text-primary underline">Become a donor today!</a></p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="text-primary"/>My Blood Requests</CardTitle>
                    <CardDescription>A list of all blood requests you've made.</CardDescription>
                </CardHeader>
                <CardContent>
                     {userRequests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Blood Group</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Hospital</TableHead>
                                    <TableHead>Urgency</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.patientName}</TableCell>
                                        <TableCell>{request.bloodGroup}</TableCell>
                                        <TableCell>{request.units}</TableCell>
                                        <TableCell>{request.hospital}</TableCell>
                                        <TableCell>{request.urgency}</TableCell>
                                        <TableCell>
                                            <Badge variant={request.status === 'Fulfilled' ? 'default' : 'destructive'}>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground">You have not made any blood requests yet. <a href="/request" className="text-primary underline">Make a request.</a></p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  )
}
