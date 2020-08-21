import { VanityURLEntity_fairOrPartner } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairContainer } from "../Fair/Fair"
import { PartnerContainer } from "../Partner"

const VanityURLEntity: React.FC<{ fairOrPartner: VanityURLEntity_fairOrPartner }> = ({ fairOrPartner }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <FairContainer fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    return <PartnerContainer partner={fairOrPartner} />
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

export const VanityURLEntityRenderer: React.SFC<{ entity: "fair" | "partner"; slug: string }> = ({ entity, slug }) => {
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
        renderPlaceholder: () => (entity === "fair" ? <HeaderTabsGridPlaceholder /> : <HeaderTabsGridPlaceholder />),
        render: (props: any) => <VanityURLEntityFragmentContainer fairOrPartner={props.vanityURLEntity} />,
      })}
    />
  )
}
