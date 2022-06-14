import { VanityURLEntity_fairOrPartner$data } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Flex, Spinner } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { FairFragmentContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner$data
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  // Because `__typename` is not allowed in fragments anymore, we need to check for the existance of `slug` or `id` in the fragment
  // https://github.com/facebook/relay/commit/ed53bb095ddd494092819884cb4f46df94b45b79#diff-4e3d961b12253787bd61506608bc366be34ab276c09690de7df17203de7581e8
  const isFair = fairOrPartner.__typename === "Fair" || "slug" in fairOrPartner
  const isPartner = fairOrPartner.__typename === "Partner" || "id" in fairOrPartner

  if (isFair) {
    return <FairFragmentContainer fair={fairOrPartner} />
  } else if (isPartner) {
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
        id
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
          showNotFoundView: false,
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
