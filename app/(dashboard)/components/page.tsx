"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/components')
      .then(res => res.json())
      .then(data => setComponents(data));
  }, []);

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (riskRating?: string) => {
    switch (riskRating) {
      case 'critical':
        return 'bg-risk-critical text-white';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Components</h1>
        <Link href="/components/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Component
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{component.name}</h3>
                    <Badge variant="outline">
                      {component.category}
                    </Badge>
                    {component.riskRating && (
                      <Badge className={getRiskColor(component.riskRating)}>
                        {component.riskRating}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Functions:</p>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {component.functions.map((func, index) => (
                        <li key={index} className="ml-4">• {func}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/components/${component.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/components/${component.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
