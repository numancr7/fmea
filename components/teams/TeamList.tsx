"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
import Link from 'next/link';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import type { Team } from '@/types/models';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TeamList: React.FC = () => {
  const { data: teams = [] } = useSWR<Team[]>('/api/teams', fetcher);
  const [open, setOpen] = React.useState(false);
  const [memberEmail, setMemberEmail] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  const handleAddMember = (team: Team) => {
    setSelectedTeam(team);
    setOpen(true);
  };

  const handleAddMemberSubmit = () => {
    toast.success(`Member email: ${memberEmail} to team: ${selectedTeam?.name}`);
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
              {teams.map((team: Team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>{team.members?.length ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddMember(team)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Link href={`/teams/${team.id}/edit`}><Edit className="h-4 w-4" /></Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              Enter the email address of the member you want to add to this team.
            </AlertDialogDescription>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border rounded"
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddMemberSubmit}>Add Member</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamList; 