import { Flex, Spinner } from "@artsy/palette-mobile"
import { VanityURLEntityQuery } from "__generated__/VanityURLEntityQuery.graphql"
import { VanityURLEntity_fairOrPartner$data } from "__generated__/VanityURLEntity_fairOrPartner.graphql"
import { Fair, FairPlaceholder, FairScreen } from "app/Scenes/Fair/Fair"
import { PartnerContainer, PartnerSkeleton } from "app/Scenes/Partner/Partner"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

export const VanityURLEntityScreenQuery = graphql`
  query VanityURLEntityQuery($id: String!) {
    vanityURLEntity(id: $id) {
      ...VanityURLEntity_fairOrPartner
    }
  }
`

interface EntityProps {
  originalSlug: string
  fairOrPartner: VanityURLEntity_fairOrPartner$data
}

export const VanityURLEntity: React.FC<EntityProps> = ({ fairOrPartner, originalSlug }) => {
  // Because `__typename` is not allowed in fragments anymore, we need to check for the existance of `slug` or `id` in the fragment
  // https://github.com/facebook/relay/commit/ed53bb095ddd494092819884cb4f46df94b45b79#diff-4e3d961b12253787bd61506608bc366be34ab276c09690de7df17203de7581e8
  const isFair = fairOrPartner.__typename === "Fair" || "slug" in fairOrPartner
  const isPartner = fairOrPartner.__typename === "Partner" || "id" in fairOrPartner

  if (isFair) {
    return <Fair fair={fairOrPartner} />
  }
  if (isPartner) {
    return <PartnerContainer partner={fairOrPartner} />
  }

  return <VanityURLPossibleRedirect slug={originalSlug} />
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
  entity?: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}

export const VanityURLEntityRenderer: React.FC<RendererProps> = ({ entity, slugType, slug }) => {
  if (slugType === "fairID") {
    return <FairScreen fairID={slug} />
  } else if (!entity && !slugType) {
    return <VanityURLPossibleRedirect slug={slug} />
  } else {
    return (
      <QueryRenderer<VanityURLEntityQuery>
        environment={getRelayEnvironment()}
        query={VanityURLEntityScreenQuery}
        variables={{ id: slug }}
        render={renderWithPlaceholder({
          showNotFoundView: false,
          renderFallback: () => <VanityURLPossibleRedirect slug={slug} />,
          renderPlaceholder: () => {
            switch (entity) {
              case "fair":
                return <FairPlaceholder />
              case "partner":
                return <PartnerSkeleton />
              default:
                return (
                  <Flex
                    style={{ flex: 1 }}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    testID="LoadingSpinner"
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
