"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FMEA } from '@/types/fmea-analysis-types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const FMEAAnalysis = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (!(session.user as any)?.emailVerified) {
      toast.error('Account Not Verified. Check your email and verify your account.');
      router.replace('/login');
    }
  }, [session, status, router]);

  const { data: fmeaList, isLoading, mutate } = useSWR<FMEA[]>('/api/fmea', fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const res = await fetch(`/api/fmea/${itemToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete FMEA');
        toast.success('FMEA has been deleted successfully');
        mutate();
      } catch {
        toast.error('Failed to delete FMEA');
      } finally {
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="pt-20 px-4">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FMEA Analysis</h1>
          <Link href="/fmea-analysis/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add FMEA
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FMEA Number</TableHead>
                <TableHead>Main Equipment</TableHead>
                <TableHead>Failure Mode Category</TableHead>
                <TableHead>Risk Rating</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Work Center</TableHead>
                <TableHead>Prepared By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9}>Loading...</TableCell></TableRow>
              ) : fmeaList && fmeaList.length > 0 ? (
                fmeaList.map((fmea) => (
                  <TableRow key={fmea.id}>
                    <TableCell className="font-medium">{fmea.fmeaNumber}</TableCell>
                    <TableCell>{fmea.mainEquipment}</TableCell>
                    <TableCell>{fmea.failureModeCategory}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fmea.mitigatedRiskRating?.startsWith('A') ? 'bg-red-100 text-red-800' :
                        fmea.mitigatedRiskRating?.startsWith('B') ? 'bg-orange-100 text-orange-800' :
                        fmea.mitigatedRiskRating?.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                        fmea.mitigatedRiskRating?.startsWith('D') ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {fmea.mitigatedRiskRating}
                      </span>
                    </TableCell>
                    <TableCell>{fmea.taskType}</TableCell>
                    <TableCell>{fmea.mainWorkCenter}</TableCell>
                    <TableCell>{fmea.preparedBy}</TableCell>
                    <TableCell>{new Date(fmea.fmeaDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/fmea-analysis/${fmea.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/fmea-analysis/${fmea.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClick(fmea.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={9}>No FMEA analyses found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this FMEA?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the FMEA analysis and all of its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default FMEAAnalysis; 
