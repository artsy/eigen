import { ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { LiveAuctionView } from "app/NativeModules/LiveAuctionView"
import { LiveSale } from "app/Scenes/LiveSale/LiveSale"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

export const LiveSaleContainer: React.FC<{ slug: string; url?: string }> = ({ slug, url }) => {
  const enabledRNLiveSaleScreen = useFeatureFlag("AREnableRNLiveSaleScreen")

  if (enabledRNLiveSaleScreen) {
    return <LiveSale slug={slug} />
  }

  // Fallback to existing behavior
  if (Platform.OS === "ios") {
    return <LiveAuctionView slug={slug} />
  }

  return <ArtsyWebViewPage url={url || `${unsafe__getEnvironment().predictionURL}/${slug}`} />
}
