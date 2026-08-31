"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient, ID } from "@/lib/appwrite/server";
import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { activeUserSchema, roleUpdateSchema } from "@/lib/validators/users";
import { mockProfiles } from "@/lib/utils/mock-data";
import type { ActionResult, Profile, SessionCookie } from "@/types";

async function persistSession(session: SessionCookie) {
  (await cookies()).set(appConfig.sessionCookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function registerUser(input: unknown): Promise<ActionResult<Profile>> {
  try {
    const values = registerSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const mockProfile: Profile = {
        userId: "user-client",
        full_name: values.full_name,
        email: values.email,
        role: "client",
        department: values.department,
        created_at: new Date().toISOString(),
        is_active: true
      };

      await persistSession({
        secret: "mock-session",
        userId: mockProfile.userId,
        role: mockProfile.role,
        email: mockProfile.email,
        name: mockProfile.full_name
      });

      return { success: true, data: mockProfile };
    }

    const { account, databases } = createAdminClient();
    const user = await account.create(ID.unique(), values.email, values.password, values.full_name);
    const session = await account.createEmailPasswordSession(values.email, values.password);

    const profile = await databases.createDocument(appConfig.databaseId, appConfig.collections.profiles, ID.unique(), {
      userId: user.$id,
      full_name: values.full_name,
      email: values.email,
      role: "client",
      department: values.department || "",
      avatar_url: "",
      created_at: new Date().toISOString()
    });

    await persistSession({
      secret: session.secret,
      userId: user.$id,
      role: "client",
      email: values.email,
      name: values.full_name
    });

    return { success: true, data: profile as unknown as Profile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registrasi gagal." };
  }
}

export async function loginUser(input: unknown): Promise<ActionResult<Profile>> {
  try {
    const values = loginSchema.parse(input);

    if (!hasAppwriteConfig()) {
      const profile = mockProfiles.find((entry) => entry.email === values.email) ?? mockProfiles[1];
      await persistSession({
        secret: "mock-session",
        userId: profile.userId,
        role: profile.role,
        email: profile.email,
        name: profile.full_name
      });
      return { success: true, data: profile };
    }

    const { account, databases } = createAdminClient();
    const session = await account.createEmailPasswordSession(values.email, values.password);
    const profiles = await databases.listDocuments(appConfig.databaseId, appConfig.collections.profiles, [
      Query.equal("email", values.email),
      Query.limit(1)
    ]);
    const profile = profiles.documents[0] as unknown as Profile | undefined;

    if (!profile) {
      return { success: false, error: "Profil pengguna tidak ditemukan." };
    }

    await persistSession({
      secret: session.secret,
      userId: profile.userId,
      role: profile.role,
      email: profile.email,
      name: profile.full_name
    });

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Login gagal." };
  }
}

export async function logoutUser() {
  (await cookies()).delete(appConfig.sessionCookieName);
  redirect("/login");
}

export async function updateUserRole(input: unknown): Promise<ActionResult> {
  try {
    const values = roleUpdateSchema.parse(input);

    if (!hasAppwriteConfig()) {
      return { success: true, data: values };
    }

    const { databases } = createAdminClient();
    const response = await databases.listDocuments(appConfig.databaseId, appConfig.collections.profiles, [
      Query.equal("userId", values.userId),
      Query.limit(1)
    ]);
    const profile = response.documents[0];

    if (!profile) {
      return { success: false, error: "Profil pengguna tidak ditemukan." };
    }

    await databases.updateDocument(appConfig.databaseId, appConfig.collections.profiles, profile.$id, {
      role: values.role
    });

    return { success: true, data: values };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengubah role." };
  }
}

export async function setUserActive(input: unknown): Promise<ActionResult> {
  try {
    const values = activeUserSchema.parse(input);

    if (!hasAppwriteConfig()) {
      return { success: true, data: values };
    }

    const { users } = createAdminClient();
    await users.updateStatus(values.userId, values.isActive);
    return { success: true, data: values };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengubah status pengguna." };
  }
}

export async function updateOwnProfile(input: Partial<Profile>): Promise<ActionResult<Profile>> {
  try {
    return { success: true, data: input as Profile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui profil." };
  }
}
