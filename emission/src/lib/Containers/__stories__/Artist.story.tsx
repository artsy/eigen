import { storiesOf } from "@storybook/react-native"
import React from "react"

import Artist from "../Artist"

// TODO: Move to metametaphysics after Relay Modern migration
import { ArtistQuery } from "__generated__/ArtistQuery.graphql"
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../relay/createEnvironment"
const RootContainer: React.SFC<any> = ({ Component, artistID }) => {
  return (
    <QueryRenderer<ArtistQuery>
      environment={createEnvironment()}
      query={graphql`
        query ArtistQuery($artistID: String!, $isPad: Boolean!) {
          artist(id: $artistID) {
            ...Artist_artist
          }
        }
      `}
      variables={{
        artistID,
        isPad: false,
      }}
      render={({ error, props }) => {
        if (error) {
          console.error(error)
        } else if (props) {
          return <Component {...props} />
        }
        return null
      }}
    />
  )
}

storiesOf("Artist/Relay")
  .add("Glenn Brown", () => {
    return <RootContainer Component={Artist} artistID="glenn-brown" />
  })
  .add("Leda Catunda", () => {
    return <RootContainer Component={Artist} artistID="glenn-brown" />
  })
  .add("Jorge Vigil", () => {
    return <RootContainer Component={Artist} artistID="glenn-brown" />
  })
  .add("Rita Maas", () => {
    return <RootContainer Component={Artist} artistID="glenn-brown" />
  })
