import { Flex, Spinner } from "@artsy/palette"
import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import InternalWebView from "lib/Components/InternalWebView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairContainer, FairPlaceholder, FairQueryRenderer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"

interface EntityProps {
  shouldInsertInset: boolean
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner
}

const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug, shouldInsertInset }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    const insets = shouldInsertInset ? safeAreaInsets : undefined
    return <PartnerContainer safeAreaInsets={insets} partner={fairOrPartner} />
  } else {
    return <InternalWebView route={originalSlug} />
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
                return <HeaderTabsGridPlaceholder />
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
              const shouldInsertInset = entity !== "unknown" // already a childVC with safeArea
              return (
                <VanityURLEntityFragmentContainer
                  fairOrPartner={props.vanityURLEntity}
                  originalSlug={slug}
                  shouldInsertInset={shouldInsertInset}
                />
              )
            } else {
              return <InternalWebView route={slug} />
            }
          },
        })}
      />
    )
  }
}
