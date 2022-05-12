import { dismissModal, navigationEvents } from "app/navigation/navigate"
import { useEffect } from "react"
import { requireNativeComponent } from "react-native"

const ARTLiveAuctionView = requireNativeComponent("ARTLiveAuctionView")

export const LiveAuctionView: React.FC<{ slug: string }> = (slug) => {
  const handleModalDismiss = () => {
    dismissModal()
  }

  useEffect(() => {
    const emitter = navigationEvents.addListener("requestModalDismiss", handleModalDismiss)

    return () => {
      emitter.removeListener("requestModalDismiss", handleModalDismiss)
    }
  }, [])

  return (
    <ARTLiveAuctionView // @ts-ignore
      slug={slug}
      style={{ flex: 1 }}
    />
  )
}
