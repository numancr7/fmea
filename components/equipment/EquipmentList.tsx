"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { PlusCircle, Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getBadgeVariant = (criticality: string) => {
  switch (criticality) {
    case "low":
      return "bg-risk-low";
    case "medium":
      return "bg-risk-medium";
    case "high":
      return "bg-risk-high";
    default:
      return "bg-muted";
  }
};

const EquipmentList: React.FC = () => {
  const router = useRouter();
  const { data: equipment = [], mutate } = useSWR("/api/equipment", fetcher);
  const { data: equipmentTypes = [], isLoading: loadingTypes, error: errorTypes } = useSWR("/api/equipment-types", fetcher);
  const { data: equipmentClasses = [], isLoading: loadingClasses, error: errorClasses } = useSWR("/api/equipment-classes", fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Defensive: always use arrays
  const safeEquipment = Array.isArray(equipment) ? equipment : [];
  const safeEquipmentTypes = Array.isArray(equipmentTypes) ? equipmentTypes : [];
  const safeEquipmentClasses = Array.isArray(equipmentClasses) ? equipmentClasses : [];

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await fetch(`/api/equipment/${itemToDelete}`, { method: "DELETE" });
      mutate();
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const getEquipmentClassName = (id: string) => {
    return safeEquipmentClasses.find((c: Record<string, unknown>) => c.id === id)?.name || "N/A";
  };

  const getEquipmentTypeName = (id: string) => {
    return safeEquipmentTypes.find((t: Record<string, unknown>) => t.id === id)?.name || "N/A";
  };

  if (loadingTypes || loadingClasses) {
    return <div>Loading...</div>;
  }
  if (errorTypes || errorClasses) {
    return <div>Error loading reference data.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Equipment List</h1>
        <Button onClick={() => router.push("/equipment/new")} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>
      <div className="bg-white rounded-md shadow">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Equipment No.</TableHead>
                <TableHead className="w-[180px]">Description</TableHead>
                <TableHead className="w-[80px]">Area</TableHead>
                <TableHead className="w-[80px]">Unit</TableHead>
                <TableHead className="w-[140px]">Functional Location</TableHead>
                <TableHead className="w-[140px]">FL from SAP</TableHead>
                <TableHead className="w-[180px]">FL Description from SAP</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Class</TableHead>
                <TableHead className="w-[80px]">Criticality</TableHead>
                <TableHead className="w-[100px]">Task Mapping</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeEquipment.map((item: Record<string, string | number | boolean | null | undefined>) => {
                return (
                  <TableRow key={item.id as string}>
                    <TableCell className="font-medium">{item.equipmentNoFromSAP as string}</TableCell>
                    <TableCell>
                      <div className="max-w-[180px] truncate" title={item.equipmentDescription as string}>
                        {item.equipmentDescription as string}
                      </div>
                    </TableCell>
                    <TableCell>{item.area as string}</TableCell>
                    <TableCell>{item.unit as string}</TableCell>
                    <TableCell>
                      <div className="max-w-[140px] truncate" title={item.functionalLocation as string}>
                        {item.functionalLocation as string}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[140px] truncate" title={item.functionalLocationFromSAP as string}>
                        {item.functionalLocationFromSAP as string}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[180px] truncate" title={item.functionalLocationDescriptionFromSAP as string}>
                        {item.functionalLocationDescriptionFromSAP as string}
                      </div>
                    </TableCell>
                    <TableCell>{getEquipmentTypeName(item.equipmentType as string)}</TableCell>
                    <TableCell>{getEquipmentClassName(item.equipmentClass as string)}</TableCell>
                    <TableCell>
                      <Badge className={getBadgeVariant(item.criticality as string)}>
                        {item.criticality as string}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* Remove Task Mapping dialog for now if it uses removed state */}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/equipment/${item.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/equipment/${item.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClick(item.id as string)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this equipment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EquipmentList; 