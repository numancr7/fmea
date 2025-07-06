"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";
import type { User, Team } from '@/types/models';

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: 'admin' | 'user'; team: string }>({ name: '', email: '', password: '', role: 'user', team: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Only admin can access
  useEffect(() => {
    if (session && session.user?.role !== "admin") {
      toast({ title: "Permission Denied", description: "Admins only." });
      router.push("/");
    }
  }, [session, router]);

  // Fetch users and teams
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('Unexpected API response format:', data);
        setUsers([]);
        toast({ title: 'Error', description: 'Failed to load users - unexpected data format' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast({ title: 'Error', description: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };
  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTeams(data);
      } else if (data && Array.isArray(data.teams)) {
        setTeams(data.teams);
      } else {
        console.error('Unexpected API response format:', data);
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  // Add/Edit User
  const openAddUser = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'user', team: '' });
    setShowDialog(true);
  };
  const openEditUser = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
      team: (user.team && typeof user.team === 'object' ? user.team.id : user.team) || '',
    });
    setShowDialog(true);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editUser ? 'PATCH' : 'POST';
      const url = editUser ? `/api/users/${editUser.id}` : '/api/users';
      const body: any = { ...form };
      if (!body.password) delete body.password;
      if (body.team === '') body.team = undefined;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save user');
      toast({ title: 'Success', description: editUser ? 'User updated' : 'User created' });
      setShowDialog(false);
      fetchUsers();
    } catch {
      toast({ title: 'Error', description: 'Failed to save user' });
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      toast({ title: 'Deleted', description: 'User deleted' });
      setShowDeleteDialog(false);
      fetchUsers();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete user' });
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };

  const getTeamName = (teamId: string | undefined) => {
    if (!teamId) return 'Not Assigned';
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  return (
    <div className="pt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button onClick={openAddUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id || user.email}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.team && typeof user.team === 'object' && 'name' in user.team
                        ? user.team.name
                        : 'Not Assigned'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditUser(user)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editUser ? "Update user details." : "Create a new user account. The user will be able to log in with these credentials."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Input name="name" value={form.name} onChange={handleFormChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input name="email" type="email" value={form.email} onChange={handleFormChange} required disabled={!!editUser} />
            </div>
            <div>
              <label className="block text-sm font-medium">Password {editUser && <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>}</label>
              <Input name="password" type="password" value={form.password} onChange={handleFormChange} autoComplete="new-password" />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select name="role" className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.role} onChange={handleFormChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Team</label>
              <select name="team" className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.team} onChange={handleFormChange}>
                <option value="">Not Assigned</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowDialog(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? (editUser ? "Saving..." : "Adding...") : (editUser ? "Save" : "Add User")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will lose all access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 
