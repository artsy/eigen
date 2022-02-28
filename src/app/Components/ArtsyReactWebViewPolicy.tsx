import React from "react"
import { ArtsyReactWebView } from "./ArtsyReactWebView"

export const ArtsyWebViewTerms: React.FC = () => {
  return <ArtsyReactWebView url="/terms" />
}

export const ArtsyWebViewPrivacy: React.FC = () => {
  return <ArtsyReactWebView url="/privacy" />
}

export const ArtsyWebViewConditionsOfSale: React.FC = () => {
  return <ArtsyReactWebView url="/conditions-of-sale" />
}
