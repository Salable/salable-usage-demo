import {salableProductUuid} from "@/app/constants";
import {Result} from "@/app/actions/checkout-link";
import {salable} from "@/app/salable";
import {EntitlementCheck} from "@salable/node-sdk/dist/src/types";

export async function entitlementCheck(granteeId: string): Promise<Result<EntitlementCheck>> {
  try {
    const check = await salable.entitlements.check({
      productUuid: salableProductUuid,
      granteeIds: [granteeId],
    })
    return {
      data: check,
      error: null
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to check entitlement'
    }
  }
}