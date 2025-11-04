import {initSalable} from "@salable/node-sdk";
import {env} from "@/app/environment";

export const salable = initSalable(env.SALABLE_API_KEY, 'v3')