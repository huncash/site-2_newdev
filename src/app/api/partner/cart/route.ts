import {
  handlePartnerCartGet,
  handlePartnerCartPut,
} from "@/auth/partner-handlers";

export async function GET(request: Request) {
  return handlePartnerCartGet(request);
}

export async function PUT(request: Request) {
  return handlePartnerCartPut(request);
}
