import { forwardRef, useImperativeHandle, useState } from "react"

export interface Disappearable {
  disappear(): Promise<void>
}

export const Disappearable = forwardRef<Disappearable, React.PropsWithChildren<{}>>(
  ({ children }, ref) => {
    const [showContent, setShowContent] = useState(true)

    useImperativeHandle(
      ref,
      () => ({
        async disappear() {
          console.log("[Debug] Disappearing...")
          await new Promise((resolve) => setTimeout(resolve, 500))
          setShowContent(false)
        },
      }),
      []
    )

    return showContent ? <>{children}</> : null
  }
)
