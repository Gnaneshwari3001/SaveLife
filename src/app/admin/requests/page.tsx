import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRequests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RequestsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline">Manage Blood Requests</h1>
        <Card>
          <CardHeader>
            <CardTitle>Request List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell className="font-medium">{request.patientName}</TableCell>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>{request.hospital}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'Fulfilled' ? 'default' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'Pending' && (
                        <Button variant="outline" size="sm">
                           <CheckCircle className="h-4 w-4 mr-2" /> Mark Fulfilled
                        </Button>
                      )}
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
