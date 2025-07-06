"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';

interface EquipmentClass {
  id: string;
  _id: string;
  name: string;
}

interface Subcomponent {
  name: string;
  remarks?: string;
}

interface ComponentType {
  name: string;
  remarks?: string;
  subcomponents?: Subcomponent[];
}

interface SystemType {
  name: string;
  components: ComponentType[];
}

interface EquipmentTypeFormProps {
  equipmentTypeId?: string;
}

const EquipmentTypeForm: React.FC<EquipmentTypeFormProps> = ({ equipmentTypeId }) => {
  const router = useRouter();
  const [equipmentClasses, setEquipmentClasses] = useState<EquipmentClass[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    equipmentClassId: '',
    systems: [] as SystemType[],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!equipmentTypeId);

  useEffect(() => {
    fetch('/api/equipment-classes')
      .then(res => res.json())
      .then(data => setEquipmentClasses(data));
  }, []);

  useEffect(() => {
    if (equipmentTypeId) {
      setFetching(true);
      fetch(`/api/equipment-types/${equipmentTypeId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            equipmentClassId: typeof data.equipmentClassId === 'object' && data.equipmentClassId !== null ? data.equipmentClassId._id : data.equipmentClassId || '',
            systems: data.systems || [],
          });
          setFetching(false);
        })
        .catch(() => {
          toast({ title: 'Error', description: 'Failed to load equipment type' });
          setFetching(false);
        });
    }
  }, [equipmentTypeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemNameChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) => i === idx ? { ...sys, name: value } : sys)
    }));
  };

  const handleAddSystem = () => {
    setFormData(prev => ({ ...prev, systems: [...prev.systems, { name: '', components: [] }] }));
  };

  const handleRemoveSystem = (idx: number) => {
    setFormData(prev => ({ ...prev, systems: prev.systems.filter((_, i) => i !== idx) }));
  };

  const handleAddComponent = (sysIdx: number) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx ? { ...sys, components: [...sys.components, { name: '' }] } : sys
      )
    }));
  };

  const handleRemoveComponent = (sysIdx: number, compIdx: number) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx ? { ...sys, components: sys.components.filter((_, j) => j !== compIdx) } : sys
      )
    }));
  };

  const handleComponentNameChange = (sysIdx: number, compIdx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx
          ? {
              ...sys,
              components: sys.components.map((comp, j) =>
                j === compIdx ? { ...comp, name: value } : comp
              ),
            }
          : sys
      )
    }));
  };

  const handleComponentRemarksChange = (sysIdx: number, compIdx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx
          ? {
              ...sys,
              components: sys.components.map((comp, j) =>
                j === compIdx ? { ...comp, remarks: value } : comp
              ),
            }
          : sys
      ),
    }));
  };

  const handleAddSubcomponent = (sysIdx: number, compIdx: number) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx
          ? {
              ...sys,
              components: sys.components.map((comp, j) =>
                j === compIdx
                  ? { ...comp, subcomponents: [...(comp.subcomponents || []), { name: '', remarks: '' }] }
                  : comp
              ),
            }
          : sys
      ),
    }));
  };

  const handleRemoveSubcomponent = (sysIdx: number, compIdx: number, subIdx: number) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx
          ? {
              ...sys,
              components: sys.components.map((comp, j) =>
                j === compIdx
                  ? { ...comp, subcomponents: (comp.subcomponents || []).filter((_, k) => k !== subIdx) }
                  : comp
              ),
            }
          : sys
      ),
    }));
  };

  const handleSubcomponentChange = (sysIdx: number, compIdx: number, subIdx: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.map((sys, i) =>
        i === sysIdx
          ? {
              ...sys,
              components: sys.components.map((comp, j) =>
                j === compIdx
                  ? {
                      ...comp,
                      subcomponents: (comp.subcomponents || []).map((sub, k) =>
                        k === subIdx ? { ...sub, [field]: value } : sub
                      ),
                    }
                  : comp
              ),
            }
          : sys
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = equipmentTypeId ? 'PATCH' : 'POST';
      const url = equipmentTypeId ? `/api/equipment-types/${equipmentTypeId}` : '/api/equipment-types';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save equipment type');
      toast({ title: 'Success', description: equipmentTypeId ? 'Equipment type updated successfully' : 'Equipment type created successfully' });
      router.push('/equipment-types');
    } catch {
      toast({ title: 'Error', description: 'Failed to save equipment type' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!equipmentTypeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/equipment-types/${equipmentTypeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete equipment type');
      toast({ title: 'Success', description: 'Equipment type deleted successfully' });
      router.push('/equipment-types');
    } catch {
      toast({ title: 'Error', description: 'Failed to delete equipment type' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" type="button" onClick={() => router.back()} className="mr-2">
            &larr; Back
          </Button>
          <h1 className="text-2xl font-bold">{equipmentTypeId ? 'Edit Equipment Boundary' : 'Add Equipment Boundary'}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipmentClassId">Equipment Class</Label>
                <select
                  id="equipmentClassId"
                  name="equipmentClassId"
                  value={formData.equipmentClassId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="">Select Equipment Class</option>
                  {equipmentClasses.map(ec => (
                    <option key={ec._id} value={ec._id}>{ec.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="name">Equipment Boundary Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter equipment boundary name"
                  className="mt-1"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Systems & Components */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Systems & Components</h2>
              <Button type="button" onClick={handleAddSystem} variant="outline">
                + Add System
              </Button>
            </div>
            {formData.systems.map((system, sysIdx) => (
              <div key={sysIdx} className="border rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Input
                    value={system.name}
                    onChange={e => handleSystemNameChange(sysIdx, e.target.value)}
                    placeholder="System Name"
                    className="mr-2"
                    required
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveSystem(sysIdx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="ml-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Components</span>
                    <Button type="button" onClick={() => handleAddComponent(sysIdx)} variant="outline" size="sm">
                      + Add Component
                    </Button>
                  </div>
                  {system.components.map((component, compIdx) => (
                    <div key={compIdx} className="border-l-2 border-gray-200 pl-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center mb-2">
                        <div>
                          <Input
                            value={component.name}
                            onChange={e => handleComponentNameChange(sysIdx, compIdx, e.target.value)}
                            placeholder="Component Name"
                            required
                          />
                        </div>
                        <div>
                          <Input
                            value={component.remarks || ''}
                            onChange={e => handleComponentRemarksChange(sysIdx, compIdx, e.target.value)}
                            placeholder="Component Remarks"
                          />
                        </div>
                        <div className="flex justify-end md:col-span-2">
                          <Button type="button" variant="destructive" onClick={() => handleRemoveComponent(sysIdx, compIdx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Subcomponents</span>
                          <Button type="button" onClick={() => handleAddSubcomponent(sysIdx, compIdx)} variant="outline" size="sm">
                            + Add Subcomponent
                          </Button>
                        </div>
                        {(component.subcomponents || []).map((sub, subIdx) => (
                          <div key={subIdx} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center mb-2">
                            <div>
                              <Input
                                value={sub.name}
                                onChange={e => handleSubcomponentChange(sysIdx, compIdx, subIdx, 'name', e.target.value)}
                                placeholder="Subcomponent Name"
                                required
                              />
                            </div>
                            <div>
                              <Input
                                value={sub.remarks || ''}
                                onChange={e => handleSubcomponentChange(sysIdx, compIdx, subIdx, 'remarks', e.target.value)}
                                placeholder="Subcomponent Remarks"
                              />
                            </div>
                            <div className="flex justify-end md:col-span-2">
                              <Button type="button" variant="destructive" onClick={() => handleRemoveSubcomponent(sysIdx, compIdx, subIdx)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-8">
            {equipmentTypeId && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (equipmentTypeId ? 'Update Equipment Boundary' : 'Create Equipment Boundary')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentTypeForm; 