import { redirect } from "next/navigation";

export default function HomePage() {
  // Langsung ke login tanpa syarat untuk memutus loop
  redirect("/login");
}
