import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { createArtist } from "app/Scenes/MyCollection/mutations/createArtist"

export const useCreateArtists = () => {
  const toast = useToast()
  const customArtists = MyCollectionAddCollectedArtistsStore.useStoreState(
    (state) => state.customArtists
  )

  const createArtists = async () => {
    if (!customArtists.length) {
      return
    }

    const results = await Promise.all(
      customArtists.map(async (customArtist) => {
        try {
          return await createArtist({
            displayName: customArtist.name,
            birthday: customArtist.birthYear,
            deathday: customArtist.deathYear,
            nationality: customArtist.nationality,
            isPersonalArtist: true,
          })
        } catch (error) {
          return null
        }
      })
    )

    const numberOfFailedResults = results.filter((result) => !result).length

    if (numberOfFailedResults > 0) {
      toast.show("Some artists could not be created.", "bottom", { backgroundColor: "red100" })
    }
  }

  return { createArtists }
}
