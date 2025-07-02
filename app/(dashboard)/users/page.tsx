import UserList from '@/components/users/UserList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserList />
    </ProtectedRoute>
  );
} 
