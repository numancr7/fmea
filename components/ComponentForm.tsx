"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const PREBUILT_MODULES = [
  "Motor",
  "Valve",
  "Pump",
  "Control System",
  "Sensor"
];

interface ComponentData {
  id?: string;
  name: string;
  description?: string;
  modules?: string[];
}

interface ComponentFormProps {
  component?: ComponentData;
  isEditing?: boolean;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ component, isEditing = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ComponentData>({
    name: component?.name || '',
    description: component?.description || '',
    modules: component?.modules || []
  });
  const [modules, setModules] = useState<string[]>([
    'Motor',
    'Valve', 
    'Pump',
    'Control System',
    'Sensor'
  ]);
  const [newModule, setNewModule] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/component-modules');
        if (response.ok) {
          const data = await response.json();
          setModules(data.map((module: any) => module.name));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load modules",
          variant: "destructive"
        });
      }
    };

    fetchModules();
  }, [modules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ComponentData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Component name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const url = isEditing && component?.id 
        ? `/api/components/${component.id}` 
        : '/api/components';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save component');
      }

      const savedComponent = await response.json();
      
      toast({
        title: isEditing ? "Component Updated" : "Component Created",
        description: isEditing 
          ? `Component "${formData.name}" has been updated successfully` 
          : `Component "${formData.name}" has been created successfully`,
      });
      
      router.push(`/components/${savedComponent.id || component?.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save component',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleName: string) => {
    setFormData((prev: ComponentData) => {
      const currentModules = prev.modules || [];
      if (currentModules.includes(moduleName)) {
        return { ...prev, modules: currentModules.filter((name: string) => name !== moduleName) };
      } else {
        return { ...prev, modules: [...currentModules, moduleName] };
      }
    });
  };

  const isModuleSelected = (moduleName: string) => {
    return formData.modules?.includes(moduleName) || false;
  };

  const addNewModule = () => {
    if (newModule.trim() && !modules.includes(newModule.trim())) {
      setModules((prev: string[]) => [...prev, newModule.trim()]);
      setNewModule('');
      
      // Auto-select the newly added module
      setFormData((prev: ComponentData) => ({
        ...prev,
        modules: [...(prev.modules || []), newModule.trim()]
      }));
      
      toast({
        title: "Module Added",
        description: `Module "${newModule}" has been added successfully`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/components">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Components
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Component' : 'Create New Component'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Component Details' : 'Enter Component Details'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Component Name *</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter component name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter component description"
                />
              </div>
            </div>

            {/* Module Selection */}
            <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
              <div>
                <Label htmlFor="moduleSelection">Component Modules</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    id="newModule"
                    placeholder="Add new module" 
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={addNewModule}
                    disabled={!newModule.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              <div>
                <Label>Available Modules</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {modules.map((moduleName) => (
                    <div key={moduleName} className="flex items-center">
                      <Checkbox 
                        id={`module-${moduleName}`}
                        checked={isModuleSelected(moduleName)}
                        onCheckedChange={() => toggleModule(moduleName)}
                        className="mr-2"
                      />
                      <label 
                        htmlFor={`module-${moduleName}`} 
                        className="text-sm cursor-pointer"
                      >
                        {moduleName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Selected Modules</Label>
                <div className="mt-2">
                  {formData.modules && formData.modules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.modules.map((moduleName) => (
                        <Badge key={moduleName} className="flex items-center gap-1">
                          {moduleName}
                          <button 
                            type="button" 
                            onClick={() => toggleModule(moduleName)}
                            className="text-xs hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No modules selected</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/components')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Component' : 'Create Component'}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ComponentForm; 