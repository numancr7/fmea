import React from 'react';
import EquipmentTypeForm from '@/components/equipment-type/EquipmentTypeForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const EquipmentTypeFormPage = async ({ params }: PageProps) => {
  const { id } = await params;
  
  return (
    <div className="pt-20 px-4">
      <EquipmentTypeForm equipmentTypeId={id} />
    </div>
  );
};

export default EquipmentTypeFormPage; 