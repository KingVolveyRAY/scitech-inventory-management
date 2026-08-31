"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getBrowserClient, browserDatabases } from "@/lib/appwrite/client";
import { appConfig } from "@/lib/appwrite/config";
import { useToast } from "@/components/ui/toast";
import { Query } from "appwrite";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  const getProfileName = useCallback(async (userId: string) => {
    try {
      if (!appConfig.endpoint || !appConfig.projectId) return "Seseorang";

      const response = await browserDatabases.listDocuments(
        appConfig.databaseId,
        appConfig.collections.profiles,
        [Query.equal("userId", userId)]
      );
      
      if (response.documents.length > 0) {
        return (response.documents[0] as any).full_name;
      }
      return "Seseorang";
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      return "Seseorang";
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    // Show toast
    notify(title, body);

    // Show browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }, [notify]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const client = getBrowserClient();

    // Subscribe to Loans
    const unsubscribeLoans = client.subscribe(
      `databases.${appConfig.databaseId}.collections.${appConfig.collections.loans}.documents`,
      async (response) => {
        const events = response.events;
        const payload = response.payload as any;
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["loans"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

        if (events.some(e => e.includes(".create"))) {
          const name = await getProfileName(payload.borrower_id);
          showNotification("Peminjaman Baru", `${name} mengajukan peminjaman baru.`);
        } else if (events.some(e => e.includes(".update"))) {
          const status = payload.status;
          const adminName = payload.admin_id ? await getProfileName(payload.admin_id) : "Admin";
          
          if (status === "approved") {
            showNotification("Pinjaman Disetujui", `Pinjaman telah disetujui oleh ${adminName}.`);
          } else if (status === "rejected") {
            showNotification("Pinjaman Ditolak", `Pinjaman telah ditolak oleh ${adminName}.`);
          } else if (status === "returning") {
            const name = await getProfileName(payload.borrower_id);
            showNotification("Pengajuan Pengembalian", `${name} mengajukan pengembalian barang.`);
          } else if (status === "returned") {
            showNotification("Barang Dikembalikan", `Pengembalian barang dikonfirmasi oleh ${adminName}.`);
          }
        }
      }
    );

    // Subscribe to Items
    const unsubscribeItems = client.subscribe(
      `databases.${appConfig.databaseId}.collections.${appConfig.collections.items}.documents`,
      async (response) => {
        const events = response.events;
        const payload = response.payload as any;

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["catalog"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "items"] });

        if (events.some(e => e.includes(".create"))) {
          const adminName = payload.admin_id ? await getProfileName(payload.admin_id) : "Admin";
          showNotification("Barang Baru", `${adminName} menambahkan barang "${payload.name}" ke inventaris.`);
        }
      }
    );

    return () => {
      unsubscribeLoans();
      unsubscribeItems();
    };
  }, [queryClient, getProfileName, showNotification]);
}
