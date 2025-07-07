"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const FailureCauseEdit = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: failureCause, isLoading } = useSWR(id ? `/api/failure-causes/${id}` : null, fetcher);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (failureCause) {
      setName(failureCause.causeName || '');
      setCode(failureCause.causeCode || '');
      setDescription(failureCause.causeDescription || '');
    }
  }, [failureCause]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !code) {
      toast({ title: 'Error', description: 'Cause name and cause code are required' });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/failure-causes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ causeName: name, causeCode: code, causeDescription: description }),
      });
      if (!res.ok) throw new Error('Failed to update failure cause');
      toast({ title: 'Success', description: 'Failure Cause Updated' });
      router.push('/failure-causes');
    } catch {
      toast({ title: 'Error', description: 'Failed to update failure cause' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="pt-20 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/failure-causes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Failure Causes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Failure Cause</h1>
        </div>
        <Card className="max-w-md">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Edit Failure Cause</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Cause Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Enter cause name"
                />
              </div>
              <div>
                <Label htmlFor="code">Cause Code *</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  placeholder="Enter cause code (e.g. HT001)"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Cause'}</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/failure-causes')} disabled={loading}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FailureCauseEdit; 