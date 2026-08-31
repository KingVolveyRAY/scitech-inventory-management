import { Boxes, ClipboardList, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<string, any> = {
  Boxes: Boxes,
  ClipboardList: ClipboardList,
  Clock: Clock,
  Users: Users
};

export function StatCard({ 
  label, 
  value, 
  helper, 
  icon 
}: { 
  label: string; 
  value: number | string; 
  helper: string;
  icon?: string;
}) {
  const Icon = icon ? ICONS[icon] : null;

  return (
    <div className="group rounded-[2rem] border border-white bg-white p-6 sm:p-8 shadow-sophisticated transition-all hover:shadow-subtle">
      <div className="flex items-start justify-between">
        <div className="space-y-3 sm:space-y-4">
          {Icon && (
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{value}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-6 flex items-center gap-2">
        <div className="h-1.5 w-6 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors" />
        <p className="text-xs font-bold text-slate-500">{helper}</p>
      </div>
    </div>
  );
}
