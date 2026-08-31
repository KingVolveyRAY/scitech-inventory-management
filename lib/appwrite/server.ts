import { Account, Client, Databases, ID, Storage, Users } from "node-appwrite";
import { appConfig, hasAppwriteConfig } from "@/lib/appwrite/config";

function baseClient() {
  const client = new Client();

  if (!hasAppwriteConfig()) {
    return client;
  }

  client.setEndpoint(appConfig.endpoint).setProject(appConfig.projectId);
  return client;
}

export function createAdminClient() {
  const client = baseClient();

  if (appConfig.apiKey) {
    client.setKey(appConfig.apiKey);
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client)
  };
}

export function createSessionClient(sessionSecret?: string) {
  const client = baseClient();

  if (sessionSecret) {
    client.setSession(sessionSecret);
  } else if (appConfig.apiKey) {
    client.setKey(appConfig.apiKey);
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client)
  };
}

export { ID };
