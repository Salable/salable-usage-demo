import {Result} from "@/app/actions/checkout-link";
import {salable} from "@/app/salable";
import {PaginatedSubscription, GetAllSubscriptionsOptions} from "@salable/node-sdk/dist/src/types";

export async function getAllSubscriptions(params?: GetAllSubscriptionsOptions): Promise<Result<PaginatedSubscription>> {
  try {
    const data = await salable.subscriptions.getAll(params)
    return {
      data, error: null
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to fetch subscriptions'
    }
  }
}


