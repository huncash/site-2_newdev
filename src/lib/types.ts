export type UserRole = "guest" | "user" | "admin" | "superadmin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: number;
  slug?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  editable?: boolean;
  specs?: Record<string, string | number>;
  category?: string;
  badge?: string;
}
