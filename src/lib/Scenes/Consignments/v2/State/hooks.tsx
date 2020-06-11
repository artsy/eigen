import { createTypedHooks } from "easy-peasy"
import { StoreState } from "lib/Scenes/Consignments/v2/State/store"

export const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreState>()
