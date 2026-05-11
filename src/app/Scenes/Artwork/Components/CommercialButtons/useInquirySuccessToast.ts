import { useToast } from "app/Components/Toast/toastHook"
import { useCallback } from "react"

export const useInquirySuccessToast = () => {
  const toast = useToast()

  return useCallback(() => {
    toast.show("Message sent", "bottom", {
      backgroundColor: "green100",
      description: "Expect a response within 1–3 business days.",
      duration: "long",
    })
  }, [toast])
}
