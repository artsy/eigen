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
import { FairContainer, FairPlaceholder } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"

const VanityURLEntity: React.FC<{ fairOrPartner: VanityURLEntity_fairOrPartner }> = ({ fairOrPartner }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    const { safeAreaInsets } = useScreenDimensions()
    return <PartnerContainer safeAreaInsets={safeAreaInsets} partner={fairOrPartner} />
  }
  throw new Error(`404`)
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

export const VanityURLEntityRenderer: React.SFC<{ entity: "fair" | "partner" | "unknown"; slug: string }> = ({
  entity,
  slug,
}) => {
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
            return <VanityURLEntityFragmentContainer fairOrPartner={props.vanityURLEntity} />
          } else {
            return <InternalWebView route={slug} />
          }
        },
      })}
    />
  )
}
