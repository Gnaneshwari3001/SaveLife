
"use client"
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Edit, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Donor } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function DonorsPage() {
  const { donors, updateDonor, deleteDonor } = useAppContext();
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (donor: Donor) => {
    setEditingDonor({ ...donor });
    setIsDialogOpen(true);
  };

  const handleFieldChange = (field: keyof Donor, value: string) => {
    if (editingDonor) {
      setEditingDonor({ ...editingDonor, [field]: value });
    }
  };

  const handleSaveChanges = () => {
    if (editingDonor) {
      updateDonor(editingDonor.id, editingDonor);
      toast({
        title: "Donor Updated",
        description: "The donor's information has been successfully updated.",
      });
      setIsDialogOpen(false);
      setEditingDonor(null);
    }
  };

  const handleDeleteDonor = (donorId: string, donorName: string) => {
    if(window.confirm(`Are you sure you want to delete donor ${donorName}?`)) {
      deleteDonor(donorId);
      toast({
        title: "Donor Deleted",
        description: `${donorName} has been removed from the database.`,
        variant: 'destructive'
      });
    }
  };


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
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="truncate max-w-[50px]">{donor.id}</TableCell>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell>{donor.bloodGroup}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>{donor.lastDonation}</TableCell>
                    <TableCell className="flex gap-2">
                       <a href={`mailto:${donor.email}`}>
                        <Button variant="outline" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </a>
                       <Button variant="outline" size="icon" onClick={() => handleEditClick(donor)}>
                          <Edit className="h-4 w-4" />
                       </Button>
                       <Button variant="destructive" size="icon" onClick={() => handleDeleteDonor(donor.id, donor.name)}>
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
            <DialogTitle>Edit Donor</DialogTitle>
          </DialogHeader>
          {editingDonor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingDonor.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" value={editingDonor.email} onChange={(e) => handleFieldChange('email', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={editingDonor.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bloodGroup" className="text-right">Blood Group</Label>
                 <Select value={editingDonor.bloodGroup} onValueChange={(value) => handleFieldChange('bloodGroup', value)}>
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
                <Label htmlFor="lastDonation" className="text-right">Last Donation</Label>
                <Input id="lastDonation" type="date" value={editingDonor.lastDonation} onChange={(e) => handleFieldChange('lastDonation', e.target.value)} className="col-span-3" />
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
