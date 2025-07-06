"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { X, Save } from 'lucide-react';
import useSWR from "swr";

type EquipmentFormData = {
  area: string;
  unit: string;
  numberOfUnits: number;
  criticality: string;
  equipmentClass: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  functionalLocation: string;
  functionalLocationFromSAP: string;
  functionalLocationDescriptionFromSAP: string;
  techIdentNoFromSAP: string;
  equipmentNoFromSAP: string;
  equipmentDescriptionFromSAP: string;
  sce: string;
  equipmentDescription: string;
  equipmentFunctions: Array<{ id: string; description: string }>;
};

const EQUIPMENT_FUNCTION_OPTIONS = [
  { id: 'moisture', description: 'Moisture Analysis' },
  { id: 'temperature', description: 'Temperature Monitoring' },
  { id: 'pressure', description: 'Pressure Monitoring' },
  { id: 'flow', description: 'Flow Measurement' },
  { id: 'level', description: 'Level Measurement' },
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EquipmentForm: React.FC<{ equipmentId?: string }> = ({ equipmentId }) => {
  const router = useRouter();
  const params = useParams();
  const id = equipmentId || params?.id;

  // Fetch options from API
  const { data: equipmentTypesRaw = [] } = useSWR<Array<{ id?: string; _id?: string; name: string }>>("/api/equipment-types", fetcher);
  const { data: equipmentClassesRaw = [] } = useSWR<Array<{ id?: string; _id?: string; name: string }>>("/api/equipment-classes", fetcher);
  const { data: manufacturersRaw = [] } = useSWR<Array<{ id?: string; _id?: string; name: string }>>("/api/manufacturers", fetcher);

  // Normalize to always have 'id' field
  const equipmentTypes = equipmentTypesRaw.map((t) => ({ ...t, id: t.id || t._id }));
  const equipmentClasses = equipmentClassesRaw.map((c) => ({ ...c, id: c.id || c._id }));
  const manufacturers = manufacturersRaw.map((m) => ({ ...m, id: m.id || m._id }));

  const [formData, setFormData] = useState<EquipmentFormData>({
    area: "",
    unit: "",
    numberOfUnits: 1,
    criticality: "medium",
    equipmentClass: "",
    equipmentType: "",
    manufacturer: "",
    model: "",
    functionalLocation: "",
    functionalLocationFromSAP: "",
    functionalLocationDescriptionFromSAP: "",
    techIdentNoFromSAP: "",
    equipmentNoFromSAP: "",
    equipmentDescriptionFromSAP: "",
    sce: "No",
    equipmentDescription: "",
    equipmentFunctions: [],
  });
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load for edit
  useEffect(() => {
    if (id) {
      fetch(`/api/equipment/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...formData,
            ...data,
            equipmentType: data.equipmentType ?? "",
            equipmentClass: data.equipmentClass ?? "",
            manufacturer: data.manufacturer ?? "",
            criticality: data.criticality ?? "medium",
            sce: data.sce ?? "No",
          });
          setSelectedFunctions((data.equipmentFunctions || []).map((f: { id: string }) => f.id));
        });
    }
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFunction = (funcId: string) => {
    setSelectedFunctions(current => {
      const exists = current.includes(funcId);
      const updated = exists ? current.filter(f => f !== funcId) : [...current, funcId];
      const functionsArray = updated.map(fid => {
        const func = EQUIPMENT_FUNCTION_OPTIONS.find(f => f.id === fid);
        return func ? { id: func.id, description: func.description } : { id: fid, description: '' };
      });
      setFormData(prev => ({ ...prev, equipmentFunctions: functionsArray }));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate id for new equipment
      const equipmentId = id || uuidv4();
      const payload = {
        ...formData,
        id: equipmentId,
        equipmentFunctions: selectedFunctions.map(fid => {
          const func = EQUIPMENT_FUNCTION_OPTIONS.find((f) => f.id === fid);
          return func ? { id: func.id, description: func.description } : { id: fid, description: '' };
        }),
      };
      const method = id ? "PATCH" : "POST";
      const url = id ? `/api/equipment/${id}` : "/api/equipment";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save equipment");
      toast({ title: "Success", description: id ? "Equipment updated successfully" : "Equipment created successfully" });
      router.push("/equipment");
    } catch {
      toast({ title: "Error", description: "Failed to save equipment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? "Edit Equipment" : "Add Equipment"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <CardContent className="space-y-8">
            {/* Equipment Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Equipment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentClass">Equipment Class</Label>
                  <Select value={formData.equipmentClass} onValueChange={v => handleSelectChange("equipmentClass", v)}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {equipmentClasses.map((c, idx) => (
                        <SelectItem key={c.id ?? idx} value={c.id?.toString() || ''}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="equipmentType">Equipment Type</Label>
                  <Select value={formData.equipmentType} onValueChange={v => handleSelectChange("equipmentType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((t, idx) => (
                        <SelectItem key={t.id ?? idx} value={t.id?.toString() || ''}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="criticality">Criticality</Label>
                  <Select value={formData.criticality} onValueChange={v => handleSelectChange("criticality", v)}>
                    <SelectTrigger><SelectValue placeholder="Select criticality" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Select value={formData.manufacturer} onValueChange={v => handleSelectChange("manufacturer", v)}>
                    <SelectTrigger><SelectValue placeholder="Select manufacturer" /></SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((m, idx) => (
                        <SelectItem key={m.id ?? idx} value={m.id?.toString() || ''}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleChange} placeholder="Enter model" />
                </div>
                <div>
                  <Label htmlFor="sce">SCE (Safety Critical Equipment)</Label>
                  <Select value={formData.sce} onValueChange={v => handleSelectChange("sce", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Yes/No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="equipmentDescription">Equipment Description</Label>
                  <Textarea id="equipmentDescription" name="equipmentDescription" value={formData.equipmentDescription} onChange={handleChange} placeholder="Enter equipment description" className="resize-none" />
                </div>
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
            {/* Equipment Functions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Equipment Functions</h2>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Select the functions this equipment performs:</p>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_FUNCTION_OPTIONS.map((func) => (
                    <div key={func.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`function-${func.id}`}
                        checked={selectedFunctions.includes(func.id)}
                        onChange={() => toggleFunction(func.id)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`function-${func.id}`} className="text-sm cursor-pointer">
                        {func.description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected Functions:</p>
                {selectedFunctions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFunctions.map((fid) => {
                      const func = EQUIPMENT_FUNCTION_OPTIONS.find(f => f.id === fid);
                      return func ? (
                        <Badge key={func.id} className="flex items-center gap-1">
                          {func.description}
                          <button type="button" onClick={() => toggleFunction(func.id)} className="text-xs hover:text-red-500">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No functions selected</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/equipment")}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {id ? "Update" : "Create"} Equipment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EquipmentForm; 