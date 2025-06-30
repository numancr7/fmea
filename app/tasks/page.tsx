"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { tasks } from '@/data/mockData';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.workCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.frequency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType.toLowerCase()) {
      case 'inspection':
        return 'bg-blue-100 text-blue-800';
      case 'replacement':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-purple-100 text-purple-800';
      case 'lubrication':
        return 'bg-green-100 text-green-800';
      case 'calibration':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'weekly':
        return 'bg-red-100 text-red-800';
      case 'monthly':
        return 'bg-orange-100 text-orange-800';
      case 'quarterly':
        return 'bg-yellow-100 text-yellow-800';
      case 'semi-annually':
        return 'bg-blue-100 text-blue-800';
      case 'annually':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/tasks/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">{task.taskType}</h3>
                    <Badge className={getTaskTypeColor(task.taskType)}>
                      {task.taskType}
                    </Badge>
                    <Badge className={getFrequencyColor(task.frequency)}>
                      {task.frequency}
                    </Badge>
                    {task.shutdownRequired && (
                      <Badge className="bg-red-100 text-red-800">
                        Shutdown Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{task.mitigationAction}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Work Center: {task.workCenter}</span>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <Link href={`/tasks/${task.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/tasks/${task.id}/edit`}>
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
};

export default Tasks; 
