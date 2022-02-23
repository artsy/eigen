import { FadeIn } from "app/Components/FadeIn"
import { Join, Spacer } from "palette"
import React from "react"
import { AutosuggestSearchResult } from "./AutosuggestSearchResult"

export const SearchResultList: React.FC<{ results: React.ReactElement[] }> = ({ results }) => {
  return (
    <Join separator={<Spacer mb={2} />}>
      {React.Children.map(results, (child, i) => {
        const props = child.props as Parameters<typeof AutosuggestSearchResult>[0]
        if (!props.result?.href) {
          console.warn("children of SearchResultList should be only of type SearchResult")
        }
        return (
          <FadeIn key={props.result.href!} delay={i * 35}>
            {child}
          </FadeIn>
        )
      })}
    </Join>
  )
}
