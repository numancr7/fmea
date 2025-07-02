"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  name: string;
  description: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'Operational' | 'Maintenance' | 'Out of Service';
  installationDate: string;
}

interface EquipmentFormProps {
  equipmentId?: string;
}

// Add enums and types for selects
const CRITICALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
const SCE_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const EQUIPMENT_FUNCTION_OPTIONS = [
  'Moisture Analysis',
  'Temperature Monitoring',
  'Pressure Monitoring',
  'Flow Measurement',
  'Level Measurement',
];

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipmentId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    area: string;
    unit: string;
    functionalLocation: string;
    functionalLocationFromSAP: string;
    functionalLocationDescriptionFromSAP: string;
    techIdentNoFromSAP: string;
    equipmentNoFromSAP: string;
    equipmentDescriptionFromSAP: string;
    sce: string;
    equipmentDescription: string;
    equipmentType: string;
    manufacturer: string;
    model: string;
    criticality: string;
    equipmentClass: string;
    equipmentFunctions: string[];
    numberOfUnits: number;
  }>({
    area: '',
    unit: '',
    functionalLocation: '',
    functionalLocationFromSAP: '',
    functionalLocationDescriptionFromSAP: '',
    techIdentNoFromSAP: '',
    equipmentNoFromSAP: '',
    equipmentDescriptionFromSAP: '',
    sce: 'No',
    equipmentDescription: '',
    equipmentType: '',
    manufacturer: '',
    model: '',
    criticality: 'medium',
    equipmentClass: '',
    equipmentFunctions: [],
    numberOfUnits: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipmentId) {
      // TODO: Replace with actual API call
      // fetch(`/api/equipment/${equipmentId}`)...
      // setFormData(...)
    }
  }, [equipmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // New handler for equipment functions as comma-separated string
  const handleFunctionsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      equipmentFunctions: value.split(',').map(f => f.trim()).filter(f => f.length > 0)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = equipmentId ? 'PATCH' : 'POST';
      const url = equipmentId ? `/api/equipment/${equipmentId}` : '/api/equipment';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save equipment');
      toast({ title: 'Success', description: equipmentId ? 'Equipment updated successfully' : 'Equipment created successfully' });
      router.push('/equipment');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save equipment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{equipmentId ? 'Edit Equipment' : 'Create New Equipment'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" name="area" value={formData.area} onChange={handleChange} placeholder="Enter area" />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" value={formData.unit} onChange={handleChange} placeholder="Enter unit" />
                </div>
                <div>
                  <Label htmlFor="numberOfUnits">Number of Units</Label>
                  <Input id="numberOfUnits" name="numberOfUnits" type="number" min={1} value={formData.numberOfUnits} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="criticality">Criticality</Label>
                  <Select value={formData.criticality} onValueChange={(v) => handleSelectChange('criticality', v)}>
                    <SelectTrigger><SelectValue placeholder="Select criticality" /></SelectTrigger>
                    <SelectContent>
                      {CRITICALITY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sce">SCE</Label>
                  <Select value={formData.sce} onValueChange={(v) => handleSelectChange('sce', v)}>
                    <SelectTrigger><SelectValue placeholder="Select SCE" /></SelectTrigger>
                    <SelectContent>
                      {SCE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="equipmentClass">Equipment Class</Label>
                  <Input id="equipmentClass" name="equipmentClass" value={formData.equipmentClass} onChange={handleChange} placeholder="Enter equipment class" />
                </div>
                <div>
                  <Label htmlFor="equipmentType">Equipment Type</Label>
                  <Input id="equipmentType" name="equipmentType" value={formData.equipmentType} onChange={handleChange} placeholder="Enter equipment type" />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="Enter manufacturer" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleChange} placeholder="Enter model" />
                </div>
              </div>
            </div>
            {/* Location Info */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="font-semibold text-lg mb-4">Location & SAP Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="functionalLocation">Functional Location</Label>
                  <Input id="functionalLocation" name="functionalLocation" value={formData.functionalLocation} onChange={handleChange} placeholder="Enter functional location" />
                </div>
                <div>
                  <Label htmlFor="functionalLocationFromSAP">Functional Location (SAP)</Label>
                  <Input id="functionalLocationFromSAP" name="functionalLocationFromSAP" value={formData.functionalLocationFromSAP} onChange={handleChange} placeholder="Enter SAP functional location" />
                </div>
                <div>
                  <Label htmlFor="functionalLocationDescriptionFromSAP">Functional Location Description (SAP)</Label>
                  <Input id="functionalLocationDescriptionFromSAP" name="functionalLocationDescriptionFromSAP" value={formData.functionalLocationDescriptionFromSAP} onChange={handleChange} placeholder="Enter SAP location description" />
                </div>
                <div>
                  <Label htmlFor="techIdentNoFromSAP">Tech Ident No (SAP)</Label>
                  <Input id="techIdentNoFromSAP" name="techIdentNoFromSAP" value={formData.techIdentNoFromSAP} onChange={handleChange} placeholder="Enter SAP tech ident no" />
                </div>
                <div>
                  <Label htmlFor="equipmentNoFromSAP">Equipment No (SAP)</Label>
                  <Input id="equipmentNoFromSAP" name="equipmentNoFromSAP" value={formData.equipmentNoFromSAP} onChange={handleChange} placeholder="Enter SAP equipment no" />
                </div>
                <div>
                  <Label htmlFor="equipmentDescriptionFromSAP">Equipment Description (SAP)</Label>
                  <Input id="equipmentDescriptionFromSAP" name="equipmentDescriptionFromSAP" value={formData.equipmentDescriptionFromSAP} onChange={handleChange} placeholder="Enter SAP equipment description" />
                </div>
              </div>
            </div>
            {/* Functions */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="font-semibold text-lg mb-2">Equipment Functions</h2>
              <p className="text-sm text-muted-foreground mb-3">Select the functions this equipment performs:</p>
              <div className="flex flex-wrap gap-4 mb-2">
                {EQUIPMENT_FUNCTION_OPTIONS.map((func) => (
                  <label key={func} className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={formData.equipmentFunctions.includes(func)}
                      onChange={() => {
                        setFormData((prev) => {
                          const exists = prev.equipmentFunctions.includes(func);
                          return {
                            ...prev,
                            equipmentFunctions: exists
                              ? prev.equipmentFunctions.filter((f) => f !== func)
                              : [...prev.equipmentFunctions, func],
                          };
                        });
                      }}
                    />
                    <span>{func}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 text-sm text-muted-foreground italic">
                <span className="font-medium not-italic text-gray-700">Selected Functions:</span>{' '}
                {formData.equipmentFunctions.length === 0
                  ? <span className="italic">No functions selected</span>
                  : formData.equipmentFunctions.join(', ')}
              </div>
            </div>
            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="font-semibold text-lg mb-4">Description</h2>
              <Textarea
                id="equipmentDescription"
                name="equipmentDescription"
                value={formData.equipmentDescription}
                onChange={handleChange}
                placeholder="Enter equipment description"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (equipmentId ? 'Update' : 'Create')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EquipmentForm; 