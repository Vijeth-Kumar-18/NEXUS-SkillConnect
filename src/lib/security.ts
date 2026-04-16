import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const AUTH_COOKIE = "nexus_auth";
const JWT_ALG = "HS256";

export type UserRole = "STUDENT" | "ADMIN";

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.NEO4J_PASSWORD || "nexus-dev-secret";
  return new TextEncoder().encode(secret);
}

export function hashPassword(plainText: string): string {
  const salt = process.env.PASSWORD_SALT || "nexus-salt";
  return crypto.createHash("sha256").update(`${plainText}:${salt}`).digest("hex");
}

export function verifyPassword(plainText: string, hash: string): boolean {
  return hashPassword(plainText) === hash;
}

export async function createAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role, email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readAuthTokenFromCookies(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secretKey(), { algorithms: [JWT_ALG] });
    const payload = verified.payload;
    if (!payload.sub || !payload.role || !payload.email || !payload.name) {
      return null;
    }

    return {
      sub: payload.sub,
      role: payload.role as UserRole,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
}
