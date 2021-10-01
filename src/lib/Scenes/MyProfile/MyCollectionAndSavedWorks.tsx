import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Sans, useColor, useSpace } from "palette"
import React from "react"
import { createFragmentContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
}

export const MyCollectionAndSavedWorks: React.FC<{ me?: MyCollectionAndSavedWorks_me }> = ({ me }) => {
  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={[
        {
          title: Tab.collection,
          content: <MyCollectionQueryRenderer />,
          initial: true,
        },
        {
          title: Tab.savedWorks,
          content: <FavoriteArtworksQueryRenderer />,
          initial: false,
        },
      ]}
      staticHeaderContent={<MyProfileHeader me={me} />}
    />
  )
}

export const MyProfileHeader: React.FC<{ me?: MyCollectionAndSavedWorks_me }> = ({ me }) => {
  const space = useSpace()
  const color = useColor()
  return (
    <>
      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/my-profile/settings")
        }}
      />
      <Box px={space(2)} pb={space(6)}>
        <Sans size="8" color={color("black100")}>
          {me?.name}
        </Sans>
        {!!me?.createdAt && (
          <Sans size="2" color={color("black60")}>{`Member since ${new Date(me?.createdAt).getFullYear()}`}</Sans>
        )}
      </Box>
    </>
  )
}

// const MyProfileHeaderFragmentContainer = createFragmentContainer(MyProfileHeader, {
//   me: graphql`
//     fragment MyCollectionAndSavedWorks_me on Me {
//       name
//       createdAt
//     }
//   `,
// })

const MyCollectionAndSavedWorksFragmentContainer = createFragmentContainer(MyCollectionAndSavedWorks, {
  me: graphql`
    fragment MyCollectionAndSavedWorks_me on Me {
      name
      createdAt
    }
  `,
})

// const MyProfileHeaderQueryRenderer = () => (
//   <QueryRenderer<MyCollectionAndSavedWorksQuery>
//     environment={defaultEnvironment}
//     query={graphql`
//       query MyCollectionAndSavedWorksQuery {
//         me {
//           ...MyCollectionAndSavedWorks_me
//         }
//       }
//     `}
//     render={renderWithPlaceholder({
//       Container: MyProfileHeaderFragmentContainer,
//       renderPlaceholder: () => <MyProfileHeader />,
//     })}
//     variables={{}}
//   />
// )

export const MyCollectionAndSavedWorksQueryRenderer: React.FC<{}> = ({}) => (
  <QueryRenderer<MyCollectionAndSavedWorksQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyCollectionAndSavedWorksQuery {
        me {
          ...MyCollectionAndSavedWorks_me
        }
      }
    `}
    render={renderWithLoadProgress(MyCollectionAndSavedWorksFragmentContainer)}
    variables={{}}
  />
)
