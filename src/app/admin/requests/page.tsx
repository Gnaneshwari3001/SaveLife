
"use client"
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trash2, RefreshCcw } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Request } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function RequestsPage() {
    const { requests, updateRequest, deleteRequest } = useAppContext();
    const [editingRequest, setEditingRequest] = useState<Request | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEditClick = (request: Request) => {
      setEditingRequest({ ...request });
      setIsDialogOpen(true);
    };
    
    const handleFieldChange = (field: keyof Request, value: string | number) => {
      if (editingRequest) {
        setEditingRequest({ ...editingRequest, [field]: value });
      }
    };
    
    const handleSaveChanges = () => {
      if (editingRequest) {
        updateRequest(editingRequest.id, editingRequest);
        toast({
          title: "Request Updated",
          description: "The request's information has been successfully updated.",
        });
        setIsDialogOpen(false);
        setEditingRequest(null);
      }
    };

    const handleDeleteRequest = (requestId: string, patientName: string) => {
      if(window.confirm(`Are you sure you want to delete the request for ${patientName}?`)) {
        deleteRequest(requestId);
        toast({
          title: "Request Deleted",
          description: `The request for ${patientName} has been removed.`,
          variant: 'destructive'
        });
      }
    };

    const toggleStatus = (request: Request) => {
        const newStatus = request.status === 'Pending' ? 'Fulfilled' : 'Pending';
        updateRequest(request.id, { ...request, status: newStatus });
         toast({
            title: "Status Updated",
            description: `The request for ${request.patientName} is now ${newStatus}.`,
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
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="truncate max-w-[50px]">{request.id}</TableCell>
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
                    <TableCell className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => toggleStatus(request)}>
                           {request.status === 'Pending' ? <CheckCircle className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(request)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request.id, request.patientName)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
          </DialogHeader>
          {editingRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientName" className="text-right">Patient</Label>
                <Input id="patientName" value={editingRequest.patientName} onChange={(e) => handleFieldChange('patientName', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hospital" className="text-right">Hospital</Label>
                <Input id="hospital" value={editingRequest.hospital} onChange={(e) => handleFieldChange('hospital', e.target.value)} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="units" className="text-right">Units</Label>
                <Input id="units" type="number" value={editingRequest.units} onChange={(e) => handleFieldChange('units', parseInt(e.target.value, 10))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bloodGroup" className="text-right">Blood Group</Label>
                 <Select value={editingRequest.bloodGroup} onValueChange={(value) => handleFieldChange('bloodGroup', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="urgency" className="text-right">Urgency</Label>
                 <Select value={editingRequest.urgency} onValueChange={(value) => handleFieldChange('urgency', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Within a Week">Within a Week</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select value={editingRequest.status} onValueChange={(value) => handleFieldChange('status', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
