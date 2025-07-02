'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', padding: 32 }}>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
} 