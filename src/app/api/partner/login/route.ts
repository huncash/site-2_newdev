import { handlePartnerLogin } from "@/auth/partner-handlers";

export async function POST(request: Request) {
  return handlePartnerLogin(request);
}
