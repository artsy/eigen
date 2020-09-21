import { Fair2Header_fair } from "__generated__/Fair2Header_fair.graphql"
import { Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Fair2HeaderProps {
  fair: Fair2Header_fair
}

export const Fair2Header: React.FC<Fair2HeaderProps> = ({ fair }) => {
  console.log("------------------------")
  const { name } = fair
  return <Sans size="8">{name}</Sans>
}

export const Fair2HeaderFragmentContainer = createFragmentContainer(Fair2Header, {
  fair: graphql`
    fragment Fair2Header_fair on Fair {
      name
    }
  `,
})
