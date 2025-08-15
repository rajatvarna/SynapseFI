import { User } from 'shared-types';

// This is a mock in-memory database.
// In a real application, you would use a persistent database like PostgreSQL, MongoDB, etc.
export const users: (Omit<User, 'id'> & { id: string; passwordHash: string })[] = [];
