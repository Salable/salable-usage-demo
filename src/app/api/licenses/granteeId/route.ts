import {NextRequest, NextResponse} from "next/server";
import {env} from "@/app/environment";
import {getIronSession} from "iron-session";
import {Session} from "@/app/settings/subscriptions/[uuid]/page";
import {cookies} from "next/headers";
import {salableApiBaseUrl} from "@/app/constants";

export const revalidate = 0

export async function GET(req: NextRequest) {
  const session = await getIronSession<Session>(cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session" });
  try {
    const res = await fetch(`${salableApiBaseUrl}/licenses/granteeId/${session.uuid}`, {
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2'
      },
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