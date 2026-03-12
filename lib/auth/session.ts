import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

const COOKIE_NAME = "cma_session";

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  cookies().set(COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function verifySession() {
  const session = cookies().get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}
