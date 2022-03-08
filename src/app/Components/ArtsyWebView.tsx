import React from "react"
import { ArtsyReactWebView } from "./ArtsyReactWebView"

export const ArtsyWebView: React.FC<{ url: string }> = ({ url }) => {
  return <ArtsyReactWebView url={url} />
}
