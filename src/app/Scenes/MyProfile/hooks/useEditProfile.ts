import { updateMyUserProfileMutation$variables } from "__generated__/updateMyUserProfileMutation.graphql"
import { useUpdateMyProfile } from "app/utils/mutations/useUpdateMyProfile"
import { useState } from "react"

export const useEditProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [commit, isMutationLoading] = useUpdateMyProfile()

  const updateProfile = async (
    input: updateMyUserProfileMutation$variables["input"],
    iconLocalPath?: string
  ) => {
    commit({
      variables: { input },

      updater: (store) => {
        if (iconLocalPath) {
          store
            .getRoot()
            ?.getLinkedRecord("me")
            ?.getOrCreateLinkedRecord("icon", "Image")
            ?.setValue(iconLocalPath, `url(version:"thumbnail")`)
        }
      },
      onError: (e) => {
        try {
          const message = JSON.parse(JSON.stringify(e))?.res?.json?.errors?.[0]?.message ?? ""
          // should be like "https://api.artsy.net/api/v1/me?email=david@artsymail.com - {"error": "User-facing error message"}"
          if (typeof message === "string") {
            const jsonString = message.match(/http.* (\{.*)$/)?.[1]
            if (jsonString) {
              const json = JSON.parse(jsonString)
              if (typeof json?.error === "string") {
                console.error(ERROR_MESSAGE, json.error)
                return
              }
              if (typeof json?.message === "string") {
                console.error(ERROR_MESSAGE, json.message)
                return
              }
            }
          }
        } catch (e) {
          console.error(ERROR_MESSAGE, e)
        }
        console.error(ERROR_MESSAGE, e)
      },
    })
  }

  return { updateProfile, isLoading: isLoading || isMutationLoading, setIsLoading }
}

const ERROR_MESSAGE = "[useEditProfile updateProfile] error:"
