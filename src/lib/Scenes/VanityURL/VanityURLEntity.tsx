import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { getCurrentEmissionState } from "lib/store/AppStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spinner } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { Fair2FragmentContainer, Fair2Placeholder } from "../Fair2/Fair2"
import { PartnerContainer } from "../Partner"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  if (fairOrPartner.__typename === "Fair") {
    const showNewFairViewFeatureEnabled = getCurrentEmissionState().options.AROptionsNewFairPage
    const fairSlugs = getCurrentEmissionState().legacyFairSlugs
    const useNewFairView = showNewFairViewFeatureEnabled && !fairSlugs?.includes(fairOrPartner.slug)

    return useNewFairView ? <Fair2FragmentContainer fair={fairOrPartner} /> : <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
        <PartnerContainer partner={fairOrPartner} />
      </View>
    )
  } else {
    return <VanityURLPossibleRedirect slug={originalSlug} />
  }
}

const VanityURLEntityFragmentContainer = createFragmentContainer(VanityURLEntity, {
  fairOrPartner: graphql`
    fragment VanityURLEntity_fairOrPartner on VanityURLEntityType
    @argumentDefinitions(useNewFairView: { type: "Boolean", defaultValue: false }) {
      __typename
      ... on Fair {
        slug
        ...Fair2_fair @include(if: $useNewFairView)
        ...Fair_fair @skip(if: $useNewFairView)
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
  const showNewFairViewFeatureEnabled = getCurrentEmissionState().options.AROptionsNewFairPage
  const fairProfileSlugs = getCurrentEmissionState().legacyFairProfileSlugs
  const useNewFairView = showNewFairViewFeatureEnabled && !fairProfileSlugs?.includes(slug)

  if (slugType === "fairID") {
    return <FairQueryRenderer fairID={slug} />
  } else {
    const { safeAreaInsets } = useScreenDimensions()
    return (
      <QueryRenderer<VanityURLEntityQuery>
        environment={defaultEnvironment}
        query={graphql`
          query VanityURLEntityQuery($id: String!, $useNewFairView: Boolean!) {
            vanityURLEntity(id: $id) {
              ...VanityURLEntity_fairOrPartner @arguments(useNewFairView: $useNewFairView)
            }
          }
        `}
        variables={{ id: slug, useNewFairView }}
        render={renderWithPlaceholder({
          renderPlaceholder: () => {
            switch (entity) {
              case "fair":
                return useNewFairView ? <Fair2Placeholder /> : <FairPlaceholder />
              case "partner":
                return (
                  <View style={{ flex: 1, top: safeAreaInsets.top ?? 0 }}>
                    <HeaderTabsGridPlaceholder />
                  </View>
                )
              default:
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
              return <VanityURLPossibleRedirect slug={slug} />
            }
          },
        })}
      />
    )
  }
}
