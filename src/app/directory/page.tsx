"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MainLayout from '@/components/layout/MainLayout'
import { MapPin, Phone, Search, Droplet } from 'lucide-react'
import { Button } from '@/components/ui/button'

const allBloodBanks = [
  { name: 'City Central Blood Bank', location: 'New York, NY', contact: '123-456-7890', available: { 'A+': 10, 'O-': 5, 'B+': 8 } },
  { name: 'Hope Donation Center', location: 'Los Angeles, CA', contact: '987-654-3210', available: { 'A+': 5, 'AB+': 2, 'O+': 12 } },
  { name: 'Downtown Blood Services', location: 'Chicago, IL', contact: '555-123-4567', available: { 'B-': 3, 'O-': 6 } },
  { name: 'Community Blood Drive Hub', location: 'Houston, TX', contact: '555-987-6543', available: { 'A-': 7, 'O+': 20 } },
  { name: 'Sunrise Health Blood Bank', location: 'Phoenix, AZ', contact: '555-456-1234', available: { 'A+': 15, 'B+': 10, 'AB-': 1 } },
  { name: 'Metro Blood Center', location: 'New York, NY', contact: '123-555-7890', available: { 'O-': 8, 'A-': 4 } },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all')

  const filteredBanks = useMemo(() => {
    return allBloodBanks.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || bank.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBloodGroup = bloodGroupFilter === 'all' || (bank.available[bloodGroupFilter as keyof typeof bank.available] && bank.available[bloodGroupFilter as keyof typeof bank.available] > 0)
      return matchesSearch && matchesBloodGroup
    })
  }, [searchTerm, bloodGroupFilter])

  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Blood Bank Directory</h1>
          <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">Find a donation center near you.</p>
        </div>
        
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or city..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Groups</SelectItem>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank, index) => (
            <Card key={index} className="flex flex-col justify-between hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>{bank.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <MapPin className="h-4 w-4" /> {bank.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                   <Phone className="h-4 w-4" /> {bank.contact}
                </div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Droplet className="h-4 w-4 text-primary" />Available Units</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(bank.available).map(([group, units]) => (
                    <div key={group} className="bg-muted px-2 py-1 rounded-md text-sm">
                      <span className="font-bold">{group}:</span> {units}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full">Contact Bank</Button>
              </CardFooter>
            </Card>
          ))}
           {filteredBanks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No blood banks found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
