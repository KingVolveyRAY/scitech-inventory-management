"use client";

import { Client, Account, Databases, Storage } from "appwrite";
import { appConfig } from "@/lib/appwrite/config";

let browserClient: Client | null = null;

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = new Client();
    
    if (appConfig.endpoint && appConfig.projectId) {
      browserClient
        .setEndpoint(appConfig.endpoint)
        .setProject(appConfig.projectId);
    }
  }

  return browserClient;
}

export const browserAccount = new Account(getBrowserClient());
export const browserDatabases = new Databases(getBrowserClient());
export const browserStorage = new Storage(getBrowserClient());
