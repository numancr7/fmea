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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Eye, Trash2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/equipment-types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getBadgeVariant = (criticality: string) => {
  switch (criticality) {
    case "low":
      return "bg-green-200 text-green-800";
    case "medium":
      return "bg-yellow-200 text-yellow-800";
    case "high":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const EquipmentList: React.FC = () => {
  const router = useRouter();
  const { data: equipment = [], mutate } = useSWR("/api/equipment", fetcher);
  const { data: equipmentTypes = [], isLoading: loadingTypes, error: errorTypes } = useSWR("/api/equipment-types", fetcher);
  const { data: equipmentClasses = [], isLoading: loadingClasses, error: errorClasses } = useSWR("/api/equipment-classes", fetcher);
  const { data: tasks = [], isLoading: loadingTasks, error: errorTasks } = useSWR("/api/tasks", fetcher);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedEquipmentForTasks, setSelectedEquipmentForTasks] = useState<any | null>(null);

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
    return equipmentClasses.find((c: any) => c.id === id)?.name || "N/A";
  };

  const getEquipmentTypeName = (id: string) => {
    return equipmentTypes.find((t: any) => t.id === id)?.name || "N/A";
  };

  const getTasksForEquipmentClass = (equipmentClassId: string) => {
    return tasks.filter((task: any) => task.equipmentClassId === equipmentClassId);
  };

  const handleTaskMappingChange = (equipmentId: string, taskId: string, isSelected: boolean) => {
    // Implement API call to update task mapping if needed
    // For now, just update local state (mock)
    // ...
  };

  const getTaskMappingStatus = (equipment: any, taskId: string) => {
    return equipment.taskListMapping?.find((tm: any) => tm.taskId === taskId)?.isSelected || false;
  };

  if (loadingTypes || loadingClasses || loadingTasks) {
    return <div>Loading...</div>;
  }
  if (errorTypes || errorClasses || errorTasks) {
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
              {equipment.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.equipmentNoFromSAP}</TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate" title={item.equipmentDescription}>
                      {item.equipmentDescription}
                    </div>
                  </TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <div className="max-w-[140px] truncate" title={item.functionalLocation}>
                      {item.functionalLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[140px] truncate" title={item.functionalLocationFromSAP}>
                      {item.functionalLocationFromSAP}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate" title={item.functionalLocationDescriptionFromSAP}>
                      {item.functionalLocationDescriptionFromSAP}
                    </div>
                  </TableCell>
                  <TableCell>{getEquipmentTypeName(item.equipmentType)}</TableCell>
                  <TableCell>{getEquipmentClassName(item.equipmentClass)}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeVariant(item.criticality)}>
                      {item.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEquipmentForTasks(item)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
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
                        onClick={() => handleDeleteClick(item.id)}
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
      </div>
      {/* Task Mapping Dialog */}
      {selectedEquipmentForTasks && (
        <AlertDialog open={!!selectedEquipmentForTasks} onOpenChange={() => setSelectedEquipmentForTasks(null)}>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Task Mapping for {selectedEquipmentForTasks.equipmentDescription}</AlertDialogTitle>
              <AlertDialogDescription>
                Select which tasks apply to this equipment. Tasks are automatically filtered by equipment class.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead className="w-[120px]">Task List</TableHead>
                    <TableHead className="w-[100px]">SAP GTL</TableHead>
                    <TableHead className="w-[200px]">Description</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Interval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTasksForEquipmentClass(selectedEquipmentForTasks.equipmentClass).map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={getTaskMappingStatus(selectedEquipmentForTasks, task.id)}
                          onChange={(e) => handleTaskMappingChange(selectedEquipmentForTasks.id, task.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>{task.taskList}</TableCell>
                      <TableCell>{task.sapGTL}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={task.taskDescription}>
                          {task.taskDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.taskType}</Badge>
                      </TableCell>
                      <TableCell>{task.interval}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Delete Confirmation Dialog */}
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