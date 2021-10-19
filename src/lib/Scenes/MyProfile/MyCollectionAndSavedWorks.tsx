import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Avatar, Box, Flex, Sans, useColor, useSpace } from "palette"
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
      <Flex flexDirection="row" alignItems="center" pl={20} pr={20}>
        <Avatar
          src="https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F2qiqRkUQYxTnUaib3yIgpA%2Funtouched-jpg.jpg&width=1820&height=1214&quality=75"
          size="md"
        />
        <Box px={space(2)}>
          <Sans size="10" color={color("black100")}>
            {me?.name}
          </Sans>
          {!!me?.createdAt && (
            <Sans size="2" color={color("black60")}>{`Member since ${new Date(me?.createdAt).getFullYear()}`}</Sans>
          )}
        </Box>
      </Flex>
      <Sans size="2" color={color("black100")} p={20}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis p
      </Sans>
    </>
  )
}

const MyCollectionAndSavedWorksFragmentContainer = createFragmentContainer(MyCollectionAndSavedWorks, {
  me: graphql`
    fragment MyCollectionAndSavedWorks_me on Me {
      name
      createdAt
    }
  `,
})

export const MyCollectionAndSavedWorksQueryRenderer: React.FC<{}> = ({}) => (
  <QueryRenderer<MyCollectionAndSavedWorksQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyCollectionAndSavedWorksQuery {
        me @optionalField {
          ...MyCollectionAndSavedWorks_me
        }
      }
    `}
    render={renderWithLoadProgress(MyCollectionAndSavedWorksFragmentContainer)}
    variables={{}}
  />
)
