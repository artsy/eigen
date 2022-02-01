import { Alert } from "react-native"

export const provideFeedback = (
  linkResponse: { success: boolean; error?: string },
  provider: string,
  mode: "link" | "unlink"
) => {
  const verb = mode === "link" ? "add" : "remov"
  const title = linkResponse.success ? "Success" : "Error"
  const body = linkResponse.error
    ? `An error occured while ${verb + "ing"} ${provider} as an authentication option to your Artsy account. \n` +
      linkResponse.error
    : `Your ${provider} account was successfully ${verb + "ed"} as an authentication option to your Artsy account.`
  Alert.alert(title, body)
}
