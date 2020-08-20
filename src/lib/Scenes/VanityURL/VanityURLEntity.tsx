import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair } from "../Fair/Fair"

const VanityURLEntity: React.FC<{ fairOrPartner: any }> = ({ fairOrPartner }) => {
  if (fairOrPartner.__typename === "Fair") {
    return <Fair fair={fairOrPartner} />
  } else if (fairOrPartner.__typename === "Partner") {
    // might need to add `safeAreaInsets.top` top padding here since `Fair` is full-bleed and `Partner` isn't.
    return null // <Partner partner={fairOrPartner} />
  }
  throw new Error(`404`)
}

const VanityURLEntityContainer = createFragmentContainer(VanityURLEntity, {
  fairOrPartner: graphql`
    fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
      ... on Fair {
        __typename
        ...Fair_fair
      }
      ... on Partner {
        __typename
        ...Partner_partner
      }
    }
  `,
})

export const VanityURLEntityQueryRenderer: React.SFC<{ entity: "fair" | "partner"; id: string }> = ({ entity, id }) => {
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
      variables={{ id }}
      render={renderWithPlaceholder({
        Container: VanityURLEntityContainer,
        renderPlaceholder: () => (entity === "fair" ? <></> : <HeaderTabsGridPlaceholder />),
      })}
    />
  )
}
