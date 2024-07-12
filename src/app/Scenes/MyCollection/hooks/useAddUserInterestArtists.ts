import {
  UserInterestCategory,
  UserInterestInterestType,
  useCreateUserInterestsMutation,
} from "__generated__/useCreateUserInterestsMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { createUserInterests } from "app/Scenes/MyCollection/mutations/createUserInterests"

export const useAddUserInterestArtists = (source: string) => {
  const toast = useToast()
  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  const addUserInterestsArtists = async () => {
    if (!artistIds.length) {
      return true
    }

    try {
      const userInterests = artistIds.map((artistId) => {
        return {
          category: "COLLECTED_BEFORE" as UserInterestCategory,
          interestId: artistId,
          interestType: "ARTIST" as UserInterestInterestType,
          private: true,
        }
      })

      const result = (await createUserInterests({
        userInterests,
      })) as useCreateUserInterestsMutation["response"]

      const failedResults = result.createUserInterests?.userInterestsOrErrors.filter(
        (result) => result.mutationError
      )

      if (failedResults?.length === userInterests.length) {
        toast.show("Artists could be added.", "bottom", { backgroundColor: "red100" })
        return false
      } else if (failedResults?.length) {
        toast.show("Some artists could not be added.", "bottom", { backgroundColor: "red100" })
        return true
      }
    } catch (error) {
      console.error(`[${source}]: error creating user interests.`, error)

      toast.show("Artists could not be added.", "bottom", { backgroundColor: "red100" })
      return false
    }

    return true
  }

  return { addUserInterestsArtists }
}
