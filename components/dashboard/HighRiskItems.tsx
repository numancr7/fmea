import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getBadgeClass = (riskRating: string) => {
  switch ((riskRating || '').toLowerCase()) {
    case 'low': return 'bg-green-700 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'high': return 'bg-red-600 text-white';
    case 'critical': return 'bg-red-800 text-white';
    default: return 'bg-muted text-black';
  }
};

const HighRiskItems = ({ items = [] }: { items: any[] }) => {
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
              {items.map(mode => (
                <li key={mode._id || mode.id} className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{mode.name || mode.description}</h4>
                      <p className="text-xs text-muted-foreground">{mode.category || mode.associatedComponent}</p>
                    </div>
                    <span className={getBadgeClass(mode.severity || mode.riskRating) + ' px-2 py-1 rounded text-xs font-bold ml-2'}>
                      {(mode.severity || mode.riskRating || '').toUpperCase()}<br />RPN: {mode.rpn}
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