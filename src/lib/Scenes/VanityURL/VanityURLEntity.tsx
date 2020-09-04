import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import InternalWebView from "lib/Components/InternalWebView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useEmissionOption } from "lib/store/AppStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spinner } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { RelativeURLWebView } from "../Artwork/Components/RelativeURLWebView"
import { FairContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  const useReactNativeWebView = useEmissionOption("AROptionsUseReactNativeWebView")
  if (fairOrPartner.__typename === "Fair") {
    return <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
        <PartnerContainer partner={fairOrPartner} />
      </View>
    )
  } else {
    if (useReactNativeWebView) {
      return <RelativeURLWebView route={originalSlug} />
    } else {
      return <InternalWebView route={originalSlug} />
    }
  }
}

const VanityURLEntityFragmentContainer = createFragmentContainer(VanityURLEntity, {
  fairOrPartner: graphql`
    fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
      __typename
      ... on Fair {
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

export const VanityURLEntityRenderer: React.SFC<RendererProps> = ({ entity, slugType, slug }) => {
  if (slugType === "fairID") {
    return <FairQueryRenderer fairID={slug} />
  } else {
    const { safeAreaInsets } = useScreenDimensions()
    const useReactNativeWebView = useEmissionOption("AROptionsUseReactNativeWebView")
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
              case "unknown":
                return (
                  <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
                    <Spinner />
                  </Flex>
                )
            }
          },
          render: (props: any) => {
            if (props.vanityURLEntity) {
              return <VanityURLEntityFragmentContainer fairOrPartner={props.vanityURLEntity} originalSlug={slug} />
            } else {
              if (useReactNativeWebView) {
                return <RelativeURLWebView route={slug} />
              } else {
                return <InternalWebView route={slug} />
              }
            }
          },
        })}
      />
    )
  }
}
