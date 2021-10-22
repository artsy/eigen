import { MyCollectionAndSavedWorks_me } from "__generated__/MyCollectionAndSavedWorks_me.graphql"
import { MyCollectionAndSavedWorksQuery } from "__generated__/MyCollectionAndSavedWorksQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Avatar, Box, Button, Flex, Join, Sans, Spacer, useColor, useSpace } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyProfileEditFormModal } from "./MyProfileEditFormModal"

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

  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <MyProfileEditFormModal visible={showModal} onDismiss={() => setShowModal(false)} />

      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/my-profile/settings")
        }}
      />
      <Join separator={<Spacer py={space(1)} />}>
        <Flex flexDirection="row" alignItems="center" px={2}>
          <Avatar
            src="https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F2qiqRkUQYxTnUaib3yIgpA%2Funtouched-jpg.jpg&width=1820&height=1214&quality=75"
            size="md"
          />
          <Box px={2} flexShrink={1}>
            <Sans size="10" color={color("black100")}>
              {me?.name}
            </Sans>
            {!!me?.createdAt && (
              <Sans size="2" color={color("black60")}>{`Member since ${new Date(me?.createdAt).getFullYear()}`}</Sans>
            )}
          </Box>
        </Flex>
        <Sans size="2" color={color("black100")} px={2}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
          sociis natoque penatibus et magnis dis p
        </Sans>
        <Flex px={2} pb={2}>
          <Button
            variant="outline"
            size="small"
            flex={1}
            onPress={() => {
              setShowModal(true)
            }}
          >
            Edit Profile
          </Button>
        </Flex>
      </Join>
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
