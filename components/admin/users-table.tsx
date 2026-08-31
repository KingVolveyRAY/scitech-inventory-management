"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAdminUsersQuery } from "@/hooks/queries/use-admin-users-query";
import { setUserActive, updateUserRole } from "@/lib/actions/users";
import { Pagination } from "@/components/ui/pagination";
import type { Profile } from "@/types";

const ITEMS_PER_PAGE = 10;

export function UsersTable({ initialData }: { initialData: Profile[] }) {
  const { data } = useAdminUsersQuery(initialData);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, page]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-subtle">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">User</th>
              <th className="px-4 py-3 whitespace-nowrap">Department</th>
              <th className="px-4 py-3 whitespace-nowrap">Role</th>
              <th className="px-4 py-3 whitespace-nowrap">Aktif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedData.map((user) => (
              <tr key={user.userId}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.full_name} />
                    <div>
                      <p className="font-medium text-slate-900">{user.full_name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">{user.department || "-"}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Select defaultValue={user.role} onValueChange={(value) => void updateUserRole({ userId: user.userId, role: value })}>
                    <SelectTrigger className="max-w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="client">client</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Switch checked={user.is_active ?? true} onCheckedChange={(checked) => void setUserActive({ userId: user.userId, isActive: checked })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
}
