import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spinner } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairFragmentContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <FairFragmentContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <View style={{ flex: 1, paddingTop: safeAreaInsets.top ?? 0 }}>
        <PartnerContainer partner={fairOrPartner} />
      </View>
    )
  } else {
    return <VanityURLPossibleRedirect slug={originalSlug} />
  }
}

const VanityURLEntityFragmentContainer = createFragmentContainer(VanityURLEntity, {
  fairOrPartner: graphql`
    fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
      __typename
      ... on Fair {
        slug
        ...Fair_fair
      }
      ... on Partner {
        ...Partner_partner
      }
    }
  `,
})

interface RendererProps {
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}

export const VanityURLEntityRenderer: React.FC<RendererProps> = ({ entity, slugType, slug }) => {
  if (slugType === "fairID") {
    return <FairQueryRenderer fairID={slug} />
  } else {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <QueryRenderer<VanityURLEntityQuery>
        environment={defaultEnvironment}
        query={graphql`
          query VanityURLEntityQuery($id: String!) {
            vanityURLEntity(id: $id) {
              ...VanityURLEntity_fairOrPartner
            }
          }
        `}
        variables={{ id: slug }}
        render={renderWithPlaceholder({
          renderFallback: () => <VanityURLPossibleRedirect slug={slug} />,
          renderPlaceholder: () => {
            switch (entity) {
              case "fair":
                return <FairPlaceholder />
              case "partner":
                return (
                  <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
                    <HeaderTabsGridPlaceholder />
                  </View>
                )
              default:
                return (
                  <Flex
                    style={{ flex: 1 }}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner />
                  </Flex>
                )
            }
          },
          render: (props: any) => {
            return (
              <VanityURLEntityFragmentContainer
                fairOrPartner={props.vanityURLEntity}
                originalSlug={slug}
              />
            )
          },
        })}
      />
    )
  }
}
