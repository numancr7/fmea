"use client";
import React from "react";
import Error from "@/app/error";

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = React.useState<Error | null>(null);
  return error ? <Error error={error} /> : <>{children}</>;
} 