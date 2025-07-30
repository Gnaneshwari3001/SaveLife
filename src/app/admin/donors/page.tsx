import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDonors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function DonorsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline">Manage Donors</h1>
        <Card>
          <CardHeader>
            <CardTitle>Donor List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDonors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell>{donor.id}</TableCell>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell>{donor.bloodGroup}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>{donor.lastDonation}</TableCell>
                    <TableCell>
                      <a href={`mailto:${donor.email}`}>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" /> Email Donor
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
