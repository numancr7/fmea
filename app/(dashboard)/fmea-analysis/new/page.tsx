"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { FMEA, RISK_MATRIX_VALUES, PROBABILITY_VALUES, TASK_TYPES } from '@/types/fmea-analysis-types';

const FMEAFormPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<FMEA>>({
    components: [],
    failureConsequences: [],
    mitigationActions: [],
    spareParts: 'N',
    isShutdownRequired: false,
  });

  const [newComponent, setNewComponent] = useState('');
  const [newConsequence, setNewConsequence] = useState('');
  const [newMitigationAction, setNewMitigationAction] = useState('');

  const handleInputChange = (field: keyof FMEA, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: 'components' | 'failureConsequences' | 'mitigationActions', value: string) => {
    if (value.trim() && !(formData[field] as string[])?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
      if (field === 'components') setNewComponent('');
      if (field === 'failureConsequences') setNewConsequence('');
      if (field === 'mitigationActions') setNewMitigationAction('');
    }
  };

  const handleArrayRemove = (field: 'components' | 'failureConsequences' | 'mitigationActions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const fmeaData: Partial<FMEA> = {
        ...formData,
        lastUpdatedBy: 'Current User',
        fmeaDate: formData.fmeaDate || new Date().toISOString().split('T')[0],
      };

      const response = await fetch('/api/fmea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fmeaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create FMEA');
      }

      toast({
        title: "FMEA Created",
        description: `FMEA ${fmeaData.fmeaNumber} has been created successfully.`,
      });
      
      router.push('/fmea-analysis');
    } catch (error) {
      console.error('Error creating FMEA:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create FMEA',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/fmea-analysis">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to FMEA List
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New FMEA Analysis</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fmeaNumber">FMEA Number *</Label>
                  <Input
                    id="fmeaNumber"
                    value={formData.fmeaNumber || ''}
                    onChange={(e) => handleInputChange('fmeaNumber', e.target.value)}
                    required
                    placeholder="e.g. FMEA-2024-001"
                  />
                </div>

                <div>
                  <Label htmlFor="mainEquipment">Main Equipment *</Label>
                  <Input
                    id="mainEquipment"
                    value={formData.mainEquipment || ''}
                    onChange={(e) => handleInputChange('mainEquipment', e.target.value)}
                    required
                    placeholder="e.g. CP-101"
                  />
                </div>

                <div>
                  <Label htmlFor="operatingCondition">Operating Condition</Label>
                  <Input
                    id="operatingCondition"
                    value={formData.operatingCondition || ''}
                    onChange={(e) => handleInputChange('operatingCondition', e.target.value)}
                    placeholder="e.g. Normal Operation - 24/7"
                  />
                </div>

                <div>
                  <Label htmlFor="availabilityTarget">Availability Target (%)</Label>
                  <Input
                    id="availabilityTarget"
                    type="number"
                    step="0.1"
                    value={formData.availabilityTarget || ''}
                    onChange={(e) => handleInputChange('availabilityTarget', parseFloat(e.target.value))}
                    placeholder="e.g. 95.5"
                  />
                </div>

                <div>
                  <Label htmlFor="redundancy">Redundancy</Label>
                  <Input
                    id="redundancy"
                    value={formData.redundancy || ''}
                    onChange={(e) => handleInputChange('redundancy', e.target.value)}
                    placeholder="e.g. None - Single Point of Failure"
                  />
                </div>

                <div>
                  <Label htmlFor="fmeaDate">FMEA Date</Label>
                  <Input
                    id="fmeaDate"
                    type="date"
                    value={formData.fmeaDate || ''}
                    onChange={(e) => handleInputChange('fmeaDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="revision">Revision</Label>
                  <Input
                    id="revision"
                    value={formData.revision || ''}
                    onChange={(e) => handleInputChange('revision', e.target.value)}
                    placeholder="e.g. Rev 1.0"
                  />
                </div>

                <div>
                  <Label htmlFor="preparedBy">Prepared By</Label>
                  <Input
                    id="preparedBy"
                    value={formData.preparedBy || ''}
                    onChange={(e) => handleInputChange('preparedBy', e.target.value)}
                    placeholder="e.g. John Smith"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Components */}
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add component"
                    value={newComponent}
                    onChange={(e) => setNewComponent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('components', newComponent))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAdd('components', newComponent)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.components?.map((component, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {component}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => handleArrayRemove('components', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Failure Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Failure Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="failureModeCategory">Failure Mode Category</Label>
                  <Input
                    id="failureModeCategory"
                    value={formData.failureModeCategory || ''}
                    onChange={(e) => handleInputChange('failureModeCategory', e.target.value)}
                    placeholder="e.g. Mechanical Failure"
                  />
                </div>

                <div>
                  <Label htmlFor="failureMechanism">Failure Mechanism</Label>
                  <Input
                    id="failureMechanism"
                    value={formData.failureMechanism || ''}
                    onChange={(e) => handleInputChange('failureMechanism', e.target.value)}
                    placeholder="e.g. Wear"
                  />
                </div>

                <div>
                  <Label htmlFor="failureCause">Failure Cause</Label>
                  <Input
                    id="failureCause"
                    value={formData.failureCause || ''}
                    onChange={(e) => handleInputChange('failureCause', e.target.value)}
                    placeholder="e.g. Poor Maintenance"
                  />
                </div>

                <div>
                  <Label htmlFor="failureCauseDescription">Failure Cause Description</Label>
                  <Textarea
                    id="failureCauseDescription"
                    value={formData.failureCauseDescription || ''}
                    onChange={(e) => handleInputChange('failureCauseDescription', e.target.value)}
                    placeholder="Describe the cause in detail"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="failureEffect">Failure Effect</Label>
                  <Textarea
                    id="failureEffect"
                    value={formData.failureEffect || ''}
                    onChange={(e) => handleInputChange('failureEffect', e.target.value)}
                    placeholder="Describe the effect of failure"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalDescription">Additional Description</Label>
                  <Textarea
                    id="additionalDescription"
                    value={formData.additionalDescription || ''}
                    onChange={(e) => handleInputChange('additionalDescription', e.target.value)}
                    placeholder="Any additional details"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="consequencePeople">Consequence (People)</Label>
                  <Select onValueChange={(value) => handleInputChange('consequencePeople', value)} value={formData.consequencePeople}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consequence" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consequenceEnvironment">Consequence (Environment)</Label>
                  <Select onValueChange={(value) => handleInputChange('consequenceEnvironment', value)} value={formData.consequenceEnvironment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consequence" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consequenceAsset">Consequence (Asset)</Label>
                  <Select onValueChange={(value) => handleInputChange('consequenceAsset', value)} value={formData.consequenceAsset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consequence" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consequenceReputation">Consequence (Reputation)</Label>
                  <Select onValueChange={(value) => handleInputChange('consequenceReputation', value)} value={formData.consequenceReputation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consequence" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="probability">Probability</Label>
                  <Select onValueChange={(value) => handleInputChange('probability', value)} value={formData.probability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select probability" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROBABILITY_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mitigatedRisk">Mitigated Risk</Label>
                  <Select onValueChange={(value) => handleInputChange('mitigatedRisk', value)} value={formData.mitigatedRisk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mitigatedRiskRating">Mitigated Risk Rating</Label>
                  <Select onValueChange={(value) => handleInputChange('mitigatedRiskRating', value)} value={formData.mitigatedRiskRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_MATRIX_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Failure Consequences */}
            <Card>
              <CardHeader>
                <CardTitle>Failure Consequences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add consequence"
                    value={newConsequence}
                    onChange={(e) => setNewConsequence(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('failureConsequences', newConsequence))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAdd('failureConsequences', newConsequence)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.failureConsequences?.map((consequence, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {consequence}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => handleArrayRemove('failureConsequences', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mitigation Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Mitigation Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add mitigation action"
                    value={newMitigationAction}
                    onChange={(e) => setNewMitigationAction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('mitigationActions', newMitigationAction))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleArrayAdd('mitigationActions', newMitigationAction)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.mitigationActions?.map((action, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {action}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => handleArrayRemove('mitigationActions', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spareParts">Spare Parts Required</Label>
                  <Select onValueChange={(value) => handleInputChange('spareParts', value)} value={formData.spareParts}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="taskType">Task Type</Label>
                  <Select onValueChange={(value) => handleInputChange('taskType', value)} value={formData.taskType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={formData.frequency || ''}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    placeholder="e.g. Monthly"
                  />
                </div>

                <div>
                  <Label htmlFor="mainWorkCenter">Work Center</Label>
                  <Input
                    id="mainWorkCenter"
                    value={formData.mainWorkCenter || ''}
                    onChange={(e) => handleInputChange('mainWorkCenter', e.target.value)}
                    placeholder="e.g. MECH"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isShutdownRequired"
                    checked={formData.isShutdownRequired || false}
                    onCheckedChange={(checked) => handleInputChange('isShutdownRequired', checked)}
                  />
                  <Label htmlFor="isShutdownRequired">Shutdown Required</Label>
                </div>

                <div>
                  <Label htmlFor="taskOriginReferences">Task Origin References</Label>
                  <Input
                    id="taskOriginReferences"
                    value={formData.taskOriginReferences || ''}
                    onChange={(e) => handleInputChange('taskOriginReferences', e.target.value)}
                    placeholder="e.g. SOP-001"
                  />
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks || ''}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="Any additional remarks"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/fmea-analysis">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Create FMEA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FMEAFormPage; 