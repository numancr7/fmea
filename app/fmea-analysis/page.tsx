"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
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

interface FMEAAnalysis {
  id: string;
  title: string;
  component: string;
  status: 'draft' | 'in-progress' | 'completed' | 'review';
  riskPriority: number;
  lastUpdated: string;
}

const FMEAAnalysis = () => {
  // Mock FMEA analysis data
  const [analysisList, setAnalysisList] = useState<FMEAAnalysis[]>([
    { 
      id: '1', 
      title: 'Pump System Analysis', 
      component: 'Centrifugal Pump',
      status: 'completed',
      riskPriority: 45,
      lastUpdated: '2024-01-15'
    },
    { 
      id: '2', 
      title: 'Motor Assembly Review', 
      component: 'Electric Motor',
      status: 'in-progress',
      riskPriority: 32,
      lastUpdated: '2024-01-10'
    },
    { 
      id: '3', 
      title: 'Control System FMEA', 
      component: 'PLC Controller',
      status: 'draft',
      riskPriority: 28,
      lastUpdated: '2024-01-08'
    },
    { 
      id: '4', 
      title: 'Hydraulic System Analysis', 
      component: 'Hydraulic Pump',
      status: 'review',
      riskPriority: 67,
      lastUpdated: '2024-01-12'
    }
  ]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, text: 'Draft' },
      'in-progress': { variant: 'default' as const, text: 'In Progress' },
      completed: { variant: 'default' as const, text: 'Completed' },
      review: { variant: 'outline' as const, text: 'Under Review' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getRiskPriorityColor = (rpn: number) => {
    if (rpn >= 60) return 'text-red-600 font-semibold';
    if (rpn >= 40) return 'text-orange-600 font-semibold';
    if (rpn >= 20) return 'text-yellow-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const itemName = analysisList.find(a => a.id === itemToDelete)?.title || 'FMEA Analysis';
      
      setAnalysisList(analysisList.filter(item => item.id !== itemToDelete));
      
      toast.success(`${itemName} has been deleted successfully`);
      
      setShowDeleteDialog(false);
      setItemToDelete(null);
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
              New FMEA Analysis
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisList.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-medium">{analysis.title}</TableCell>
                  <TableCell>{analysis.component}</TableCell>
                  <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                  <TableCell className={getRiskPriorityColor(analysis.riskPriority)}>
                    {analysis.riskPriority}
                  </TableCell>
                  <TableCell>{analysis.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/fmea-analysis/${analysis.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/fmea-analysis/${analysis.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteClick(analysis.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this FMEA analysis?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the FMEA analysis and all associated data.
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
