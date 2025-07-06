"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, X } from 'lucide-react';
import type { EquipmentType, EquipmentClass, Manufacturer } from '@/types/models';

interface EquipmentFormData {
  equipmentType: string;
  equipmentClass: string;
  manufacturer: string;
  model: string;
  criticality: string;
  sce: string;
  equipmentDescription: string;
  area: string;
  unit: string;
  numberOfUnits: number;
  functionalLocation: string;
  functionalLocationFromSAP: string;
  functionalLocationDescriptionFromSAP: string;
  techIdentNoFromSAP: string;
  equipmentNoFromSAP: string;
  equipmentDescriptionFromSAP: string;
  equipmentFunctions: string[];
}

const EQUIPMENT_FUNCTION_OPTIONS = [
  { id: 'moisture', description: 'Moisture Analysis' },
  { id: 'temperature', description: 'Temperature Monitoring' },
  { id: 'pressure', description: 'Pressure Monitoring' },
  { id: 'flow', description: 'Flow Measurement' },
  { id: 'level', description: 'Level Measurement' },
];

const EditEquipmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState<EquipmentFormData | null>(null);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [equipmentClasses, setEquipmentClass] = useState<EquipmentClass[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const eqRes = await fetch(`/api/equipment/${id}`);
      if (!eqRes.ok) return setLoading(false);
      const eq = await eqRes.json();
      setFormData({
        equipmentType: eq.equipmentType ?? "",
        equipmentClass: eq.equipmentClass ?? "",
        manufacturer: eq.manufacturer ?? "",
        model: eq.model ?? "",
        criticality: eq.criticality ?? "medium",
        sce: eq.sce ?? "No",
        equipmentDescription: eq.equipmentDescription ?? "",
        area: eq.area ?? "",
        unit: eq.unit ?? "",
        numberOfUnits: eq.numberOfUnits ?? 1,
        functionalLocation: eq.functionalLocation ?? "",
        functionalLocationFromSAP: eq.functionalLocationFromSAP ?? "",
        functionalLocationDescriptionFromSAP: eq.functionalLocationDescriptionFromSAP ?? "",
        techIdentNoFromSAP: eq.techIdentNoFromSAP ?? "",
        equipmentNoFromSAP: eq.equipmentNoFromSAP ?? "",
        equipmentDescriptionFromSAP: eq.equipmentDescriptionFromSAP ?? "",
        equipmentFunctions: eq.equipmentFunctions ?? [],
      });
      setSelectedFunctions((eq.equipmentFunctions || []).map((f: any) => f.id));
      // Fetch reference data
      const [typesRes, classesRes, mansRes] = await Promise.all([
        fetch('/api/equipment-types'),
        fetch('/api/equipment-classes'),
        fetch('/api/manufacturers'),
      ]);
      const [types, classes, mans] = await Promise.all([
        typesRes.json(),
        classesRes.json(),
        mansRes.json(),
      ]);
      setEquipmentTypes(types.map((t: any) => ({ ...t, id: t.id || t._id })));
      setEquipmentClass(classes.map((c: any) => ({ ...c, id: c.id || c._id })));
      setManufacturers(mans.map((m: any) => ({ ...m, id: m.id || m._id })));
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const toggleFunction = (funcId: string) => {
    setSelectedFunctions(current => {
      const exists = current.includes(funcId);
      const updated = exists ? current.filter(f => f !== funcId) : [...current, funcId];
      setFormData((prev) => prev ? { ...prev, equipmentFunctions: updated } : null);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    try {
      // Map selectedFunctions to objects with id and description
      const functionsArray = selectedFunctions.map(fid => {
        const func = EQUIPMENT_FUNCTION_OPTIONS.find((f) => f.id === fid);
        return func ? { id: func.id, description: func.description } : { id: fid, description: '' };
      });
      const payload = {
        ...formData,
        equipmentFunctions: functionsArray,
      };
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update equipment');
      toast.success('Equipment updated successfully');
      router.push('/equipment');
    } catch {
      toast.error('Failed to update equipment');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <div className="p-8">Loading...</div>;

  return (
    <div className="pt-20 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Equipment</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <CardContent className="space-y-8">
            {/* Equipment Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Equipment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentClass">Equipment Class</Label>
                  <select
                    id="equipmentClass"
                    name="equipmentClass"
                    className="w-full border rounded px-2 py-2"
                    value={formData.equipmentClass}
                    onChange={e => handleSelectChange('equipmentClass', e.target.value)}
                  >
                    <option value="">Select class</option>
                    {equipmentClasses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="equipmentType">Equipment Type</Label>
                  <select
                    id="equipmentType"
                    name="equipmentType"
                    className="w-full border rounded px-2 py-2"
                    value={formData.equipmentType}
                    onChange={e => handleSelectChange('equipmentType', e.target.value)}
                  >
                    <option value="">Select type</option>
                    {equipmentTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="criticality">Criticality</Label>
                  <select
                    id="criticality"
                    name="criticality"
                    className="w-full border rounded px-2 py-2"
                    value={formData.criticality}
                    onChange={e => handleSelectChange('criticality', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <select
                    id="manufacturer"
                    name="manufacturer"
                    className="w-full border rounded px-2 py-2"
                    value={formData.manufacturer}
                    onChange={e => handleSelectChange('manufacturer', e.target.value)}
                  >
                    <option value="">Select manufacturer</option>
                    {manufacturers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleChange} placeholder="Enter model" />
                </div>
                <div>
                  <Label htmlFor="sce">SCE (Safety Critical Equipment)</Label>
                  <select
                    id="sce"
                    name="sce"
                    className="w-full border rounded px-2 py-2"
                    value={formData.sce}
                    onChange={e => handleSelectChange('sce', e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="equipmentDescription">Equipment Description</Label>
                <Textarea id="equipmentDescription" name="equipmentDescription" value={formData.equipmentDescription} onChange={handleChange} placeholder="Enter equipment description" className="resize-none" />
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Location Information</h2>
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
                  <Label htmlFor="functionalLocation">Functional Location</Label>
                  <Input id="functionalLocation" name="functionalLocation" value={formData.functionalLocation} onChange={handleChange} placeholder="Enter functional location" />
                </div>
                <div>
                  <Label htmlFor="functionalLocationFromSAP">Functional Location from SAP</Label>
                  <Input id="functionalLocationFromSAP" name="functionalLocationFromSAP" value={formData.functionalLocationFromSAP} onChange={handleChange} placeholder="Enter SAP functional location" />
                </div>
                <div>
                  <Label htmlFor="functionalLocationDescriptionFromSAP">Functional Location Description from SAP</Label>
                  <Input id="functionalLocationDescriptionFromSAP" name="functionalLocationDescriptionFromSAP" value={formData.functionalLocationDescriptionFromSAP} onChange={handleChange} placeholder="Enter SAP location description" />
                </div>
                <div>
                  <Label htmlFor="techIdentNoFromSAP">Tech Ident No. from SAP</Label>
                  <Input id="techIdentNoFromSAP" name="techIdentNoFromSAP" value={formData.techIdentNoFromSAP} onChange={handleChange} placeholder="Enter SAP tech ident no" />
                </div>
                <div>
                  <Label htmlFor="equipmentNoFromSAP">Equipment No. from SAP</Label>
                  <Input id="equipmentNoFromSAP" name="equipmentNoFromSAP" value={formData.equipmentNoFromSAP} onChange={handleChange} placeholder="Enter SAP equipment no" />
                </div>
                <div>
                  <Label htmlFor="equipmentDescriptionFromSAP">Equipment Description from SAP</Label>
                  <Input id="equipmentDescriptionFromSAP" name="equipmentDescriptionFromSAP" value={formData.equipmentDescriptionFromSAP} onChange={handleChange} placeholder="Enter SAP equipment description" />
                </div>
              </div>
            </div>

            {/* Equipment Functions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Equipment Functions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EQUIPMENT_FUNCTION_OPTIONS.map((func) => (
                  <div key={func.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={func.id}
                      checked={selectedFunctions.includes(func.id)}
                      onChange={() => toggleFunction(func.id)}
                      className="rounded"
                    />
                    <Label htmlFor={func.id} className="text-sm">
                      {func.description}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/equipment')} disabled={saving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditEquipmentPage; 