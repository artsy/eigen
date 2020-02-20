import { Join, Spacer } from "@artsy/palette"
import React from "react"
import { FadeIn } from "./FadeIn"
import { SearchResult } from "./SearchResult"

export const SearchResultList: React.FC<{ results: React.ReactElement[] }> = ({ results }) => {
  return (
    <Join separator={<Spacer mb={2} />}>
      {React.Children.map(results, (child, i) => {
        if (__DEV__ && child.type !== SearchResult) {
          throw new Error("children of SearchResultList should be only of type SearchResult")
        }
        const props = child.props as Parameters<typeof SearchResult>[0]
        return (
          <FadeIn key={props.result.href} delay={i * 35}>
            {child}
          </FadeIn>
        )
      })}
    </Join>
  )
}
