import { OwnerType } from "@artsy/cohesion"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { times } from "lodash"
import { Flex, Join, Separator } from "palette"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { MyCollectionAndSavedWorks, Tab } from "./MyCollectionAndSavedWorks"
import { OldMyProfileSettings } from "./MyProfileSettings"

export const MyProfile: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const shouldDisplayMyCollection = me?.labFeatures?.includes("My Collection")
  if (shouldDisplayMyCollection) {
    return <MyCollectionAndSavedWorks me={me} initialTab={Tab.collection} />
  }
  return <OldMyProfileSettings me={me} relay={relay} />
}

export const MyProfilePlaceholder: React.FC<{}> = () => (
  <Flex pt="3" px="2">
    <Join separator={<Separator my={2} />}>
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
        <Flex flexDirection="row" py={2}>
          {times(3).map((index: number) => (
            <Flex key={index} marginRight={1}>
              <PlaceholderBox height={120} width={120} />
              <PlaceholderText marginTop={20} key={index} width={40 + Math.random() * 80} />
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        {times(3).map((index: number) => (
          <Flex key={index} py={1}>
            <PlaceholderText width={200 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </Join>
  </Flex>
)

export const MyProfileContainer = createRefetchContainer(
  MyProfile,
  {
    me: graphql`
      fragment MyProfile_me on Me {
        name
        labFeatures
        createdAt
        followsAndSaves {
          artworksConnection(first: 10, private: true) {
            edges {
              node {
                id
                ...SmallTileRail_artworks
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query MyProfileRefetchQuery {
      me {
        ...MyProfile_me
      }
    }
  `
)

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => (
  <ProvideScreenTrackingWithCohesionSchema info={screen({ context_screen_owner_type: OwnerType.profile })}>
    <QueryRenderer<MyProfileQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileQuery {
          me @optionalField {
            ...MyProfile_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfileContainer,
        renderPlaceholder: () => <MyProfilePlaceholder />,
      })}
      variables={{}}
    />
  </ProvideScreenTrackingWithCohesionSchema>
)
