"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, UserPlus } from "lucide-react";
import Link from 'next/link';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TeamList: React.FC = () => {
  const { data, error, isLoading } = useSWR("/api/teams", fetcher);
  const [open, setOpen] = React.useState(false);
  const [memberEmail, setMemberEmail] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState<any>(null);

  const handleAddMemberClick = (team: any) => {
    setSelectedTeam(team);
    setOpen(true);
  };

  const handleAddMember = () => {
    toast({ title: 'Add Member', description: `Member email: ${memberEmail} to team: ${selectedTeam?.name}` });
    setOpen(false);
    setMemberEmail("");
    setSelectedTeam(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teams Management</h1>
        <Button asChild>
          <Link href="/teams/new">Create Team</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading teams...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">Failed to load teams</TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (
                data.map((team: any) => (
                  <TableRow key={team._id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.description}</TableCell>
                    <TableCell>{team.members?.length ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddMemberClick(team)}>
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/teams/${team._id}/edit`}><Edit className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No teams found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Modal for adding member */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Member to {selectedTeam?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the email of the member you want to add.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="email"
            placeholder="Member Email"
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddMember}>
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamList; 