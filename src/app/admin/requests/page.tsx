"use client"
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

export default function RequestsPage() {
    const { requests, updateRequestStatus } = useAppContext();

    const markFulfilled = (id: string, patientName: string) => {
        updateRequestStatus(id, 'Fulfilled');
        toast({
            title: "Request Fulfilled",
            description: `The request for ${patientName} has been marked as fulfilled.`,
        });
    }

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
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell className="font-medium">{request.patientName}</TableCell>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>{request.hospital}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'Fulfilled' ? 'default' : (request.status === 'Pending' ? 'destructive' : 'secondary')}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'Pending' && (
                        <Button variant="outline" size="sm" onClick={() => markFulfilled(request.id, request.patientName)}>
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
