import { createContextStore } from "easy-peasy"
import { ArtworkFiltersStore } from "./ArtworkFiltersStore"

export const ArtworkFiltersStoreContext = createContextStore<ArtworkFiltersStore>(ArtworkFiltersStore)

export const ArtworkFiltersStoreProvider = ArtworkFiltersStoreContext.Provider
