import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const failureModes = [
  { id: 1, description: 'Impeller Failure', category: 'Mechanical Failure', riskRating: 'high', rpn: 125 },
  { id: 2, description: 'Stator Winding Failure', category: 'Electrical Failure', riskRating: 'critical', rpn: 200 },
  { id: 3, description: 'Bearing failure', category: 'Mechanical Failure', riskRating: 'high', rpn: 168 },
];
const components = [
  { id: 1, name: 'Impeller', category: 'Rotating', riskRating: 'high' },
  { id: 2, name: 'Bearing Assembly', category: 'Rotating', riskRating: 'high' },
  { id: 3, name: 'Stator Winding', category: 'Electrical', riskRating: 'critical' },
];

const getBadgeClass = (riskRating: string) => {
  switch (riskRating) {
    case 'low': return 'bg-green-700 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'high': return 'bg-red-600 text-white';
    case 'critical': return 'bg-red-800 text-white';
    default: return 'bg-muted text-black';
  }
};

const HighRiskItems = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>High Risk Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Failure Modes</h3>
            <ul className="space-y-2">
              {failureModes.map(mode => (
                <li key={mode.id} className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{mode.description}</h4>
                      <p className="text-xs text-muted-foreground">{mode.category}</p>
                    </div>
                    <span className={getBadgeClass(mode.riskRating) + ' px-2 py-1 rounded text-xs font-bold ml-2'}>
                      {mode.riskRating.toUpperCase()}<br />RPN: {mode.rpn}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Components</h3>
            <ul className="space-y-2">
              {components.map(comp => (
                <li key={comp.id} className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{comp.name}</h4>
                      <p className="text-xs text-muted-foreground">{comp.category}</p>
                    </div>
                    <span className={getBadgeClass(comp.riskRating) + ' px-2 py-1 rounded text-xs font-bold ml-2'}>
                      {comp.riskRating.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighRiskItems;