"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";

const EquipmentClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentClasses, setEquipmentClasses] = useState([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/equipment-classes')
      .then(res => res.json())
      .then(data => setEquipmentClasses(data));
  }, []);

  const filteredEquipment = equipmentClasses.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.function.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'high':
        return 'bg-risk-high text-white';
      case 'medium':
        return 'bg-risk-medium text-white';
      case 'low':
        return 'bg-risk-low text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/equipment-classes/${deletingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete equipment class');
      setEquipmentClasses(prev => prev.filter((eq: any) => eq.id !== deletingId));
      toast({ title: 'Deleted', description: 'Equipment class deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete equipment class' });
    } finally {
      setShowConfirm(false);
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Equipment Classes</h1>
        <Link href="/equipment-classes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Equipment Class
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Classes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEquipment.map((equipment) => (
              <div
                key={equipment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{equipment.name}</h3>
                    <Badge className={getCriticalityColor(equipment.criticality)}>
                      {equipment.criticality}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">{equipment.function}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/equipment-classes/${equipment.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/equipment-classes/${equipment.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(equipment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-background rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Delete Equipment Class?</h2>
            <p className="mb-4">Are you sure you want to delete this equipment class? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentClasses; 
