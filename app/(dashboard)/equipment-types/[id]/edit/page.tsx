"use client";

import React from 'react';
import EquipmentTypeForm from '@/components/equipment-type/EquipmentTypeForm';
import { useParams } from 'next/navigation';

const EquipmentTypeFormPage = () => {
  const params = useParams();
  const equipmentTypeId = params.id as string;
  return (
    <div className="pt-20 px-4">
      <EquipmentTypeForm equipmentTypeId={equipmentTypeId} />
    </div>
  );
};

export default EquipmentTypeFormPage; 