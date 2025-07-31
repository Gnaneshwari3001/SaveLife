
"use client"
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

export default function BanksPage() {
  const { banks, addBank } = useAppContext();
  const [newBankName, setNewBankName] = useState("");
  const [newBankLocation, setNewBankLocation] = useState("");
  const [newBankContact, setNewBankContact] = useState("");

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newBankLocation || !newBankContact) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to add a new bank.",
        variant: "destructive",
      });
      return;
    }
    
    addBank({
      name: newBankName,
      location: newBankLocation,
      contact: newBankContact,
    });

    toast({
      title: "Bank Added",
      description: `${newBankName} has been successfully added.`,
    });

    setNewBankName("");
    setNewBankLocation("");
    setNewBankContact("");
  };

  return (
    <AdminLayout>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Blood Bank List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell>{bank.id}</TableCell>
                      <TableCell className="font-medium">{bank.name}</TableCell>
                      <TableCell>{bank.location}</TableCell>
                      <TableCell>{bank.contact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Blood Bank</CardTitle>
              <CardDescription>Enter the details for the new entry.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBank} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input 
                    id="bank-name" 
                    placeholder="e.g., Unity Blood Center" 
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-location">Location</Label>
                  <Input 
                    id="bank-location" 
                    placeholder="e.g., Springfield, IL" 
                    value={newBankLocation}
                    onChange={(e) => setNewBankLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-contact">Contact Info</Label>
                  <Input 
                    id="bank-contact" 
                    placeholder="e.g., 555-555-5555" 
                    value={newBankContact}
                    onChange={(e) => setNewBankContact(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Bank
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
