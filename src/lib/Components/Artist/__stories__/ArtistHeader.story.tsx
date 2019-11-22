import { storiesOf } from "@storybook/react-native"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import React from "react"
import { View } from "react-native"

// TODO: Move to metametaphysics after Relay Modern migration
import { ArtistHeaderQuery } from "__generated__/ArtistHeaderQuery.graphql"
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../../relay/createEnvironment"
const RootContainer: React.SFC<any> = ({ Component, artistID }) => {
  return (
    <QueryRenderer<ArtistHeaderQuery>
      environment={createEnvironment()}
      query={graphql`
        query ArtistHeaderQuery($artistID: String!) {
          artist(id: $artistID) {
            ...Header_artist
          }
        }
      `}
      variables={{
        artistID,
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

storiesOf("Artist/ArtistHeader")
  .addDecorator(story => <View style={{ marginLeft: 20, marginRight: 20 }}>{story()}</View>)
  .add("Real Artist - Glenn Brown", () => {
    return <RootContainer Component={ArtistHeader} artistID="glenn-brown" />
  })
  .add("Real Artist - Leda Catunda", () => {
    return <RootContainer Component={ArtistHeader} artistID="leda-catunda" />
  })
// TODO: Move to metametaphysics after Relay Modern migration
//
// Note that for these two, the follow button / count will remain the
// same as it was from one of the above artists. Once they are in relay/graphQL
// stubbing that data can be a possiblity
// .add("No Birthday", () => {
//   const props = {
//     artist: {
//       name: "Example Data",
//       nationality: "UK",
//       counts: { follows: 12 },
//     },
//   }
//   return <StubContainer Component={Header} props={props} />
// })
// .add("Full Data", () => {
//   const api = {
//     artist: {
//       name: "Another Exmaple",
//       nationality: "OK",
//       birthday: "1999",
//       counts: { follows: 12 },
//     },
//   }
//   return <StubContainer Component={Header} props={api} />
// })
