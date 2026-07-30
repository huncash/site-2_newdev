import { redirect } from "next/navigation";

/** Legacy alias → teljes árrés-kalkulátor modul. */
export default function AdminArresRedirect() {
  redirect("/admin/arres-kalkulacio");
}
