import React, { FC } from "react"

interface WrapProps {
  if: boolean
  with: (children: React.ReactNode) => JSX.Element
}

export const Wrap: FC<WrapProps> = ({ if: condition, with: wrapper, children }) =>
  condition ? wrapper(children) : <>{children}</>
