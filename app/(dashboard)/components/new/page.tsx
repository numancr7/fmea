"use client";

import React from 'react';
import ComponentForm from "@/components/ComponentForm";

export default function NewComponentPage() {
  return (
    <div className="pt-20 px-4">
      <ComponentForm isEditing={false} />
    </div>
  );
}
