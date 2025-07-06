"use client";
import React from "react";
import Error from "@/app/error";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  error?: Error;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, error }) => {
  return error ? <Error error={error} /> : <>{children}</>;
};

export default ErrorBoundary; 