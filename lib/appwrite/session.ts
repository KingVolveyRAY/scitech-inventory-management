import { cookies } from "next/headers";
import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";
import { getCurrentUserProfile } from "@/lib/appwrite/queries";
import type { SessionCookie } from "@/types";

export async function getSessionCookie(): Promise<SessionCookie | null> {
  const raw = (await cookies()).get(appConfig.sessionCookieName)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionCookie;
  } catch {
    return null;
  }
}

export async function getLoggedInUser() {
  const session = await getSessionCookie();

  if (!session) {
    return null;
  }

  // Prevent Guest scope error when stale mock session is present with real config
  if (session.secret === "mock-session" && hasAppwriteConfig()) {
    return null;
  }

  const profile = await getCurrentUserProfile(session.secret, session.userId);
  if (!profile) {
    return null;
  }

  return {
    session,
    profile
  };
}
