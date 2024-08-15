import { useAddUserInterestArtists } from "app/Scenes/MyCollection/hooks/useAddUserInterestArtists"
import { useCreateArtists } from "app/Scenes/MyCollection/hooks/useCreateArtists"
import { useState } from "react"

export const useSubmitMyCollectionArtists = (source: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createArtists } = useCreateArtists()
  const { addUserInterestsArtists } = useAddUserInterestArtists(source)

  const submit = async () => {
    setIsSubmitting(true)

    await createArtists()

    const addingUserInterestsSucceeded = await addUserInterestsArtists()

    setIsSubmitting(false)

    return addingUserInterestsSucceeded
  }

  return { submit, isSubmitting }
}
