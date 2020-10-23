import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import { getCurrentEmissionState } from "lib/store/AppStore"
import React from "react"

export const SaleFAQ: React.FC<{}> = () => {
  return <ArtsyWebView url={`${getCurrentEmissionState().webURL}/auction-faq`} />
}
