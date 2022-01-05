import React from "react"
import { ArtsyReactWebView } from "./ArtsyReactWebView"

export const RenderTerms: React.FC = () => {
  return <ArtsyReactWebView url="/terms" />
}

export const RenderPrivacy: React.FC = () => {
  return <ArtsyReactWebView url="/privacy" />
}

export const RenderConditionsOfSale: React.FC = () => {
  return <ArtsyReactWebView url="/conditions-of-sale" />
}
