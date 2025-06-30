export interface User {
    id?: string;
    email: string;
    password?: string; // Optional for security - only used during auth
    name: string;
    role: 'admin' | 'user';
    roomId?: string;
    phone?: string;
    address?: string;
    createdAt?: string;
  }
  