import React from "react"
import { StickyTabPage } from "./StickyTabPage"

export const withStickyTabPage = (WrappedComponent: React.FC<any>) => (
  <StickyTabPage
    tabs={[
      {
        title: "test",
        content: <WrappedComponent />,
      },
    ]}
  />
)
