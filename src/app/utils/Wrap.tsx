import React, { FC, ReactNode } from "react"

interface WrapProps {
  if: boolean
  with: (children: ReactNode) => JSX.Element
}

export const Wrap: FC<WrapProps> = ({ if: condition, with: wrapper, children }) => {
  return condition ? wrapper(children) : <>{children}</>
}
