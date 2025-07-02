"use client";

import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserList() {
  const { data, error, isLoading } = useSWR("/api/users", fetcher);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">Failed to load users</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        {isAdmin && (
          <Button asChild>
            <Link href="/users/new">Add User</Link>
          </Button>
        )}
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
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.team?.name || "—"}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/users/${user._id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to delete this user?')) return;
                            if (!isAdmin) {
                              toast({ title: 'Permission Denied', description: 'You must be an admin to delete users.' });
                              return;
                            }
                            try {
                              const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
                              if (!res.ok) throw new Error('Failed to delete user');
                              toast({ title: 'Success', description: 'User deleted' });
                              // Optionally, trigger a re-fetch or update UI
                              window.location.reload();
                            } catch (error) {
                              toast({ title: 'Error', description: 'Failed to delete user' });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 