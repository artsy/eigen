import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, SkeletonBox, SkeletonText, Spacer, Text } from "@artsy/palette-mobile"
import { MyProfilePaymentDeleteCardMutation } from "__generated__/MyProfilePaymentDeleteCardMutation.graphql"
import { MyProfilePaymentQuery } from "__generated__/MyProfilePaymentQuery.graphql"
import { MyProfilePayment_me$data } from "__generated__/MyProfilePayment_me.graphql"
import { CreditCardDetailsContainer } from "app/Components/CreditCardDetails"
import { MenuItem } from "app/Components/MenuItem"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { REFRESH_CREDIT_CARDS_LIST_KEY, RefreshEvents } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { Suspense, useCallback, useEffect, useReducer, useState } from "react"
import { ActivityIndicator, Alert, FlatList, LayoutAnimation, RefreshControl } from "react-native"
import {
  commitMutation,
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
  useLazyLoadQuery,
} from "react-relay"

const NUM_CARDS_TO_FETCH = 100 // stupidly high because most people will have 1 or *maybe* 2

// VERY DIRTY HACK!
// When creating a new card we need to wait for a refresh of this screen before navigating back.
// At the moment the only way for these screens to communicate is via global state, since we can't
// transmit react contexts accross screens.

const MyProfilePayment: React.FC<{ me: MyProfilePayment_me$data; relay: RelayPaginationProp }> = ({
  relay,
  me,
}) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [deletingIDs, dispatch] = useReducer(
    (
      state: { [internalID: string]: boolean },
      action:
        | { type: "deleting"; internalID: string }
        | { type: "not deleting"; internalID: string }
    ) => {
      switch (action.type) {
        case "deleting":
          return { ...state, [action.internalID]: true }
        case "not deleting":
          return { ...state, [action.internalID]: false }
      }
    },
    {}
  )

  useEffect(() => {
    RefreshEvents.addListener(REFRESH_CREDIT_CARDS_LIST_KEY, handleRefreshEvent)
    return () => {
      RefreshEvents.removeListener(REFRESH_CREDIT_CARDS_LIST_KEY, handleRefreshEvent)
    }
  }, [])

  const handleRefreshEvent = () => {
    onRefresh()
  }

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetchConnection(NUM_CARDS_TO_FETCH, () => {
      setIsRefreshing(false)
    })
  }, [])

  const onLoadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading() || isLoadingMore) {
      return
    }
    setIsLoadingMore(true)
    relay.loadMore(NUM_CARDS_TO_FETCH, () => {
      setIsLoadingMore(false)
    })
  }, [isLoadingMore, relay])

  const onRemove = (internalID: string) => {
    dispatch({ type: "deleting", internalID })
    commitMutation<MyProfilePaymentDeleteCardMutation>(relay.environment, {
      mutation: graphql`
        mutation MyProfilePaymentDeleteCardMutation($internalID: String!) {
          deleteCreditCard(input: { id: $internalID }) {
            creditCardOrError {
              ... on CreditCardMutationFailure {
                mutationError {
                  error
                }
              }
            }
          }
        }
      `,
      variables: {
        internalID,
      },
      onError() {
        dispatch({ type: "not deleting", internalID })
        Alert.alert("Something went wrong.")
      },
      onCompleted(data) {
        if (data.deleteCreditCard?.creditCardOrError?.mutationError) {
          Alert.alert("Something went wrong.")
          dispatch({ type: "not deleting", internalID })
        } else {
          relay.refetchConnection(NUM_CARDS_TO_FETCH, () => {
            dispatch({ type: "not deleting", internalID })
            LayoutAnimation.configureNext({
              duration: 380,
              update: { type: "spring", springDamping: 0.8 },
            })
          })
        }
      },
    })
  }

  const creditCards = extractNodes(me.creditCards)

  if (enableRedesignedSettings) {
    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.accountPayment,
        })}
      >
        <MyProfileScreenWrapper
          title="Payments"
          RefreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <Text>Add your payment details for a faster checkout experience.</Text>
          <Spacer y={2} />
          <FlatList
            data={creditCards}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CreditCardDetailsContainer
                card={item}
                onPress={() => onRemove(item.internalID)}
                isDeleting={deletingIDs[item.internalID]}
              />
            )}
            onEndReached={onLoadMore}
            ItemSeparatorComponent={() => <Spacer y={1} />}
            ListFooterComponent={
              <Flex py={2}>
                <RouterLink hasChildTouchable to="/my-profile/payment/new-card">
                  <Button block>Add new card</Button>
                </RouterLink>
                {!!isLoadingMore && <ActivityIndicator style={{ marginTop: 30 }} />}
              </Flex>
            }
          />
        </MyProfileScreenWrapper>
      </ProvideScreenTrackingWithCohesionSchema>
    )
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPayment,
      })}
    >
      <FlatList
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={creditCards}
        keyExtractor={(item) => item.internalID}
        contentContainerStyle={{ paddingTop: creditCards.length === 0 ? 10 : 20 }}
        renderItem={({ item }) => (
          <Flex px={2}>
            <CreditCardDetailsContainer
              card={item}
              onPress={() => onRemove(item.internalID)}
              isDeleting={deletingIDs[item.internalID]}
            />
          </Flex>
        )}
        onEndReached={onLoadMore}
        ItemSeparatorComponent={() => <Spacer y={1} />}
        ListFooterComponent={
          <Flex pt={creditCards.length === 0 ? undefined : 2}>
            <MenuItem title="Add New Card" href="/my-profile/payment/new-card" />
            {!!isLoadingMore && <ActivityIndicator style={{ marginTop: 30 }} />}
          </Flex>
        }
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyProfilePaymentPlaceholder: React.FC<{}> = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")
  return enableRedesignedSettings ? (
    <MyProfileScreenWrapper title="Payments" contentContainerStyle={{ paddingHorizontal: 0 }}>
      <Flex p={2}>
        <SkeletonText>Add your payment details for a faster checkout</SkeletonText>
        <Spacer y={2} />
        <SkeletonBox height={40} />
      </Flex>
    </MyProfileScreenWrapper>
  ) : (
    <Flex p={2}>
      {times(2).map((index: number) => (
        <Flex key={index} py={1}>
          <SkeletonText>Credit card </SkeletonText>
        </Flex>
      ))}
    </Flex>
  )
}

const MyProfilePaymentContainer = createPaginationContainer(
  MyProfilePayment,
  {
    me: graphql`
      fragment MyProfilePayment_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        name
        creditCards(first: $count, after: $cursor)
          @connection(key: "MyProfilePayment_creditCards") {
          edges {
            node {
              internalID
              ...CreditCardDetails_card
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me.creditCards
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyProfilePaymentPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyProfilePayment_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyProfilePaymentScreenQuery = graphql`
  query MyProfilePaymentQuery($count: Int!) {
    me {
      ...MyProfilePayment_me @arguments(count: $count)
    }
  }
`
export const myProfilePaymentQueryDefaultVariables = { count: NUM_CARDS_TO_FETCH }

const MyProfilePaymentSuspense: React.FC = () => {
  const data = useLazyLoadQuery<MyProfilePaymentQuery>(
    MyProfilePaymentScreenQuery,
    { ...myProfilePaymentQueryDefaultVariables },
    { fetchPolicy: "store-and-network" }
  )

  return <MyProfilePaymentContainer me={data.me} />
}

export const MyProfilePaymentQueryRenderer: React.FC = () => {
  return (
    <Suspense fallback={<MyProfilePaymentPlaceholder />}>
      <MyProfilePaymentSuspense />
    </Suspense>
  )
}
