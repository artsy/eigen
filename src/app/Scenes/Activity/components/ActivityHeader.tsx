import { Flex, Pill } from "@artsy/palette-mobile"
import { ActivityHeaderQuery } from "__generated__/ActivityHeaderQuery.graphql"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ActivityHeader: React.FC = () => {
  const data = useLazyLoadQuery<ActivityHeaderQuery>(query, {})

  const type = ActivityScreenStore.useStoreState((state) => state.type)
  const setType = ActivityScreenStore.useStoreActions((actions) => actions.setType)

  const displayOffersFilter = !!data?.viewer?.partnerOfferNotifications?.totalCount

  return (
    <Flex px={2} pb={2}>
      <Flex flexDirection="row">
        <Pill variant="default" selected={type === "all"} mr={0.5} onPress={() => setType("all")}>
          All
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
      </Flex>
    </Flex>
  )
}

const query = graphql`
  query ActivityHeaderQuery {
    viewer {
      partnerOfferNotifications: notificationsConnection(
        first: 1
        notificationTypes: [PARTNER_OFFER_CREATED]
      ) {
        totalCount
      }
    }
  }
`
