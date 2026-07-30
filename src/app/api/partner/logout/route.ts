import { handlePartnerLogout } from "@/auth/partner-handlers";

export async function POST() {
  return handlePartnerLogout();
}
