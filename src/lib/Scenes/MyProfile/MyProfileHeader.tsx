import { MyProfileHeader_me } from "__generated__/MyProfileHeader_me.graphql"
import { Box, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  me: MyProfileHeader_me
}

export const MyProfileHeader: React.FC<Props> = ({ me }) => {
  return (
    <Box px={2} pt={6} pb={1}>
      <Sans size="8">{me.name}</Sans>
      <Sans size="8">{`Member since ${me.name}`}</Sans>
    </Box>
  )
}

export const MyProfileHeaderFragmentContainer = createFragmentContainer(MyProfileHeader, {
  me: graphql`
    fragment MyProfileHeader_me on Me {
      name
      created_at
    }
  `,
})
