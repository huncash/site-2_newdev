import { handlePartnerSession } from "@/auth/partner-handlers";

export async function GET(request: Request) {
  return handlePartnerSession(request);
}
