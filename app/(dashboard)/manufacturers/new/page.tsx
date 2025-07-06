"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactInfo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const ManufacturerForm = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactInfo: '',
      website: '',
    },
  });

  // Load data if in edit mode
  useEffect(() => {
    const fetchManufacturer = async () => {
      if (!isEdit) return;
      
      try {
        setInitialLoading(true);
        const response = await fetch(`/api/manufacturers/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch manufacturer');
        }
        
        const manufacturer = await response.json();
        form.reset({
          name: manufacturer.name,
          contactInfo: manufacturer.contactInfo || '',
          website: manufacturer.website || '',
        });
      } catch (error) {
        console.error('Error fetching manufacturer:', error);
        toast({
          title: "Error",
          description: "Failed to load manufacturer data",
          variant: "destructive"
        });
        router.push('/manufacturers');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchManufacturer();
  }, [isEdit, id, form, router]);

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      
      const url = isEdit ? `/api/manufacturers/${id}` : '/api/manufacturers';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} manufacturer`);
      }

      toast({
        title: isEdit ? "Manufacturer Updated" : "Manufacturer Created",
        description: `${values.name} has been ${isEdit ? 'updated' : 'created'} successfully`,
      });
      
      router.push('/manufacturers');
    } catch (error) {
      console.error('Error saving manufacturer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} manufacturer`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading manufacturer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <div className="flex items-center mb-6">
        <Link href="/manufacturers">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : 'Add'} Manufacturer</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter contact information" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Link href="/manufacturers">
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
              {isEdit ? 'Update' : 'Create'} Manufacturer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManufacturerForm; 
