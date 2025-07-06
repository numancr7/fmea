"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const stockStatusOptions = [
  { value: 'In Stock', label: 'In Stock' },
  { value: 'Low Stock', label: 'Low Stock' },
  { value: 'Out of Stock', label: 'Out of Stock' },
];

const currencyOptions = [
  { value: 'RM', label: 'RM' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

const SparePartForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    equipmentId: '',
    materialNumber: '',
    materialDescription: '',
    proposeStock: '',
    minimum: '',
    maximum: '',
    price: '',
    currency: '',
    stockStatus: '',
    remarks: '',
  });
  const { data: equipmentList = [] } = useSWR('/api/equipment', fetcher);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.equipmentId || !formData.materialNumber || !formData.materialDescription) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await fetch('/api/spare-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create spare part');
      toast.success('Spare Part Created');
      router.push('/spare-parts');
    } catch {
      toast.error('Failed to create spare part');
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/spare-parts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Spare Parts
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Spare Part</h1>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Enter Spare Part Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentId">Equipment</Label>
                  <Select value={formData.equipmentId} onValueChange={v => handleSelectChange('equipmentId', v)}>
                    <SelectTrigger id="equipmentId">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentList.map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialNumber">Material Number</Label>
                  <Input id="materialNumber" name="materialNumber" value={formData.materialNumber} onChange={handleChange} required placeholder="Enter material number" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="materialDescription">Material Description</Label>
                  <Input id="materialDescription" name="materialDescription" value={formData.materialDescription} onChange={handleChange} required placeholder="Enter material description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposeStock">Propose Stock</Label>
                  <Input id="proposeStock" name="proposeStock" type="number" value={formData.proposeStock} onChange={handleChange} placeholder="Enter propose stock" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum">Minimum</Label>
                  <Input id="minimum" name="minimum" type="number" value={formData.minimum} onChange={handleChange} placeholder="Enter minimum stock" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum">Maximum</Label>
                  <Input id="maximum" name="maximum" type="number" value={formData.maximum} onChange={handleChange} placeholder="Enter maximum stock" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Enter price" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={v => handleSelectChange('currency', v)}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockStatus">Stock Status</Label>
                  <Select value={formData.stockStatus} onValueChange={v => handleSelectChange('stockStatus', v)}>
                    <SelectTrigger id="stockStatus">
                      <SelectValue placeholder="Select stock status" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockStatusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Enter remarks" rows={3} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push('/spare-parts')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Spare Part
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SparePartForm; 
