import "server-only";

import bcrypt from "bcryptjs";

import { getUserByEmail, type StoredUser } from "@/lib/data-provider";
import type { User, UserRole } from "@/lib/types";
import { toPublicUser } from "./session-token";

interface EnvUser {
  id: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

function stripEnvWrapping(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvUsers(): EnvUser[] {
  const raw = process.env.AUTH_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as EnvUser[];
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (u) =>
            typeof u?.id === "string" &&
            typeof u?.email === "string" &&
            typeof u?.role === "string" &&
            typeof u?.passwordHash === "string"
        );
      }
    } catch {
      // ignore malformed AUTH_USERS
    }
  }

  const emailRaw = process.env.AUTH_ADMIN_EMAIL;
  const passwordHashRaw = process.env.AUTH_ADMIN_PASSWORD_HASH;
  const email = emailRaw ? stripEnvWrapping(emailRaw) : "";
  const passwordHash = passwordHashRaw ? stripEnvWrapping(passwordHashRaw) : "";
  if (email && passwordHash) {
    return [
      {
        id: process.env.AUTH_ADMIN_ID?.trim() || "env-admin",
        email,
        role: (process.env.AUTH_ADMIN_ROLE as UserRole) || "admin",
        passwordHash,
      },
    ];
  }

  return [];
}

function findCredentialUser(email: string): EnvUser | StoredUser | null {
  const normalized = email.trim().toLowerCase();
  const envUser = parseEnvUsers().find(
    (u) => u.email.trim().toLowerCase() === normalized
  );
  if (envUser) {
    return envUser;
  }

  try {
    const stored = getUserByEmail(email.trim());
    if (stored?.passwordHash) {
      return stored;
    }
  } catch {
    // private source missing / unreadable — ENV credentials still work
  }

  return null;
}

export async function authenticateWithPassword(
  email: string,
  password: string
): Promise<User | null> {
  if (!email?.trim() || !password) {
    return null;
  }

  const record = findCredentialUser(email);
  if (!record?.passwordHash) {
    await bcrypt.compare(
      password,
      "$2b$10$UB6g93Lt4wqexGta/4r6S.NOyVe0BT9N1h6vTe085cXVy7exBVcAO"
    );
    return null;
  }

  const ok = await bcrypt.compare(password, record.passwordHash);
  if (!ok) {
    return null;
  }

  return toPublicUser(record);
}
