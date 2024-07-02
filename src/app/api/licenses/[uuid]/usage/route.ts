import {NextRequest, NextResponse} from "next/server";
import {env} from "@/app/environment";
import {randomUUID} from "node:crypto";

export async function GET(req: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const res = await fetch(`https://6h12fk1bmd.execute-api.eu-west-2.amazonaws.com/dev/licenses/${params.uuid}/usage`, {
      method: "GET",
      headers: {
        'x-api-key': env.DEV_SALABLE_API_KEY,
        version: 'v2',
      },
      cache: "no-store",
    })
    const data = await res.json()
    console.log(data)
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

export async function PUT(req: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const increment = await req.json()
    const res = await fetch(`https://6h12fk1bmd.execute-api.eu-west-2.amazonaws.com/dev/usage`, {
      method: "PUT",
      headers: {
        'x-api-key': env.DEV_SALABLE_API_KEY,
        version: 'v2',
        'unique-key': randomUUID()
      },
      body: JSON.stringify({
        licenseUuid: params.uuid,
        countOptions: increment
      }),
      cache: "no-store",
    })
    return NextResponse.json(
       { status: res.status }
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