import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { useCallback } from "react"

export const useInquirySuccessPopover = () => {
  const popoverMessage = usePopoverMessage()

  return useCallback(() => {
    popoverMessage.show({
      title: "Message Sent\nExpect a response within 1–3 business days.",
      placement: "top",
      type: "success",
    })

    setTimeout(() => {
      popoverMessage.hide()
    }, 2000)
  }, [popoverMessage])
}
