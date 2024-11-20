import {NextRequest, NextResponse} from "next/server";
import {env} from "@/app/environment";
import {cookies} from "next/headers";
import {getIronSession} from "iron-session";
import {Session} from "@/app/settings/subscriptions/[uuid]/page";
import {salableApiBaseUrl} from "@/app/constants";

export const revalidate = 0

export async function GET(req: NextRequest) {
  const session = await getIronSession<Session>(cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-usage" });
  try {
    const productUuid = req.nextUrl.searchParams.get('productUuid')
    const res = await fetch(`${salableApiBaseUrl}/licenses/check?granteeIds=${session.uuid}&productUuid=${productUuid}`, {
      headers: { 'x-api-key': env.SALABLE_API_KEY },
      cache: "no-store"
    })
    const headers = new Headers(res.headers)
    const headersMap = new Map(headers)
    if (headersMap.get('content-type') === 'text/plain') {
      return NextResponse.json(
        { status: res.status }
      );
    }
    const data = await res.json()
    return NextResponse.json(
      data, { status: res.status }
    );
  } catch (e) {
    const error = e as Error
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}