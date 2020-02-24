import { storiesOf } from "@storybook/react-native"
import React from "react"
import "react-native"
// import StubContainer from "react-storybooks-relay-container"

import Inbox from "../index"

// TODO: Move to metametaphysics after Relay Modern migration
import { InboxQuery } from "__generated__/InboxQuery.graphql"
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../../../relay/createEnvironment"
// TODO: This fails due to Relay trying to request `id` for the Node interface. Probably because we need to switch from
//      compat to modern?
//
// Question: Why do we need to define a `after` variable, but don’t need to specify anything for it?
const RootContainer: React.SFC<any> = ({ Component }) => {
  return (
    <QueryRenderer<InboxQuery>
      environment={createEnvironment()}
      query={graphql`
        query InboxQuery($cursor: String) {
          me {
            ...Inbox_me
          }
        }
      `}
      variables={{}}
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

storiesOf("Conversations/Overview").add("With live data", () => <RootContainer Component={Inbox} />)
// TODO: Move to metametaphysics after Relay Modern migration
// .add("With dummy data", () => <StubContainer Component={Inbox} props={{ me: meProps }} />)
// .add("With no data", () => <StubContainer Component={Inbox} props={{ me: { conversations: { edges: [] } } }} />)

// TODO: Uncomment when ^ is fixed
// const meProps = {
//   conversations: {
//     edges: [
//       {
//         node: {
//           id: "582",
//           inquiry_id: "59302144275b244a81d0f9c6",
//           from: {
//             name: "Jean-Luc Collecteur",
//             email: "luc+messaging@artsymail.com",
//           },
//           to: { name: "ACA Galleries" },
//           last_message: "Karl and Anna... Fab!",
//           created_at: "2017-06-01T14:14:35.538Z",
//           artworks: [
//             {
//               id: "bradley-theodore-karl-and-anna-face-off-diptych",
//               href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
//               title: "Karl and Anna Face Off (Diptych)",
//               date: "2016",
//               artist_names: "Bradley Theodore",
//               image: {
//                 url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
//                 image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
//               },
//             },
//           ],
//         },
//       },
//       {
//         node: {
//           id: "581",
//           inquiry_id: "593020be8b3b814f9f86f2fd",
//           from: {
//             name: "Jean-Luc Collecteur",
//             email: "luc+messaging@artsymail.com",
//           },
//           to: { name: "David Krut Projects" },
//           last_message:
//             "Hi, I’m interested in purchasing this work. \
//                     Could you please provide more information about the piece?",
//           created_at: "2017-06-01T14:12:19.155Z",
//           artworks: [
//             {
//               id: "aida-muluneh-darkness-give-way-to-light-1",
//               href: "/artwork/aida-muluneh-darkness-give-way-to-light-1",
//               title: "Darkness Give Way to Light",
//               date: "2016",
//               artist_names: "Aida Muluneh",
//               image: {
//                 url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/normalized.jpg",
//                 image_url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/:version.jpg",
//               },
//             },
//           ],
//         },
//       },
//     ],
//   },
// }
