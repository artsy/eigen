import { Flex, Pill } from "@artsy/palette-mobile"
import { NewActivityHeaderQuery } from "__generated__/NewActivityHeaderQuery.graphql"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { graphql, useLazyLoadQuery } from "react-relay"

export const NewActivityHeader: React.FC = () => {
  const data = useLazyLoadQuery<NewActivityHeaderQuery>(query, {})

  const type = ActivityScreenStore.useStoreState((state) => state.type)
  const setType = ActivityScreenStore.useStoreActions((actions) => actions.setType)

  const displayOffersFilter = !!data?.viewer?.partnerOfferNotifications?.edges?.length

  return (
    <Flex px={2} pb={2}>
      <Flex flexDirection="row">
        <Pill variant="default" selected={type === "all"} mr={0.5} onPress={() => setType("all")}>
          All
        </Pill>
        <Pill
          variant="default"
          mr={0.5}
          selected={type === "alerts"}
          onPress={() => setType("alerts")}
        >
          Alerts
        </Pill>
        <Pill
          variant="default"
          mr={0.5}
          selected={type === "follows"}
          onPress={() => setType("follows")}
        >
          Follows
        </Pill>
        {!!displayOffersFilter && (
          <Pill
            variant="default"
            mr={0.5}
            selected={type === "offers"}
            onPress={() => setType("offers")}
          >
            Offers
          </Pill>
        )}
      </Flex>
    </Flex>
  )
}

const query = graphql`
  query NewActivityHeaderQuery {
    viewer {
      partnerOfferNotifications: notificationsConnection(
        first: 1
        notificationTypes: [PARTNER_OFFER_CREATED]
      ) {
        # Total count does not work and returns a value even when there are no notifications
        # TODO: Use totalCount once the issue is fixed
        edges {
          node {
            id
          }
        }
      }
    }
  }
`
