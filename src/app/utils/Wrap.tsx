import React, { ReactNode } from "react"
import { getChildrenByTypeDeep } from "react-nanny"

interface WrapProps {
  if: boolean
  children?: ReactNode
}

export const Wrap = ({ if: condition, children }: WrapProps) => {
  if (condition) {
    return <>{children}</>
  }

  const wrapContentChilden = getChildrenByTypeDeep(children, Wrap.Content)
  if (wrapContentChilden.length === 0) {
    throw new Error("Wrap.Content is required")
  }
  if (wrapContentChilden.length > 1) {
    throw new Error("You can't have more than one Wrap.Content")
  }

  const actualWrapContent = wrapContentChilden[0]
  return <>{actualWrapContent}</>
}

Wrap.Content = ({ children }: { children?: ReactNode }) => <>{children}</>
