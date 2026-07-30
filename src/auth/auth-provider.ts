import authConfig from "../config/auth.json";
import type { User, UserRole } from "@/lib/types";
import type { PublicSession } from "./session-token";

export type AdminLevel = UserRole;
export type Session = PublicSession;

interface AuthState {
  session: Session | null;
}

function resolveRoleLevel(role: AdminLevel): number {
  return authConfig.roles[role] ?? authConfig.roles.guest;
}

function isSessionValid(session: Session | null): session is Session {
  if (!session?.token || !session.user) {
    return false;
  }

  return new Date(session.expiresAt).getTime() > Date.now();
}

export class AuthProvider {
  private state: AuthState = { session: null };

  setSession(session: Session | null): void {
    if (session && !isSessionValid(session)) {
      this.state.session = null;
      return;
    }

    this.state.session = session;
  }

  getSession(): Session | null {
    if (!isSessionValid(this.state.session)) {
      this.state.session = null;
      return null;
    }

    return this.state.session;
  }

  getAccessToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  getUser(): User | null {
    return this.getSession()?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  logout(): void {
    this.state.session = null;
  }

  getAdminLevel(): number {
    const user = this.getUser();
    if (!user) {
      return authConfig.roles.guest;
    }

    return resolveRoleLevel(user.role);
  }

  hasRole(role: AdminLevel): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  hasMinimumRole(role: AdminLevel): boolean {
    return this.getAdminLevel() >= resolveRoleLevel(role);
  }

  isAdmin(): boolean {
    return this.hasMinimumRole("admin");
  }

  isSuperAdmin(): boolean {
    return this.hasRole("superadmin");
  }

  canAccess(requiredRole: AdminLevel): boolean {
    return this.hasMinimumRole(requiredRole);
  }
}

export const authProvider = new AuthProvider();

export type { User };
