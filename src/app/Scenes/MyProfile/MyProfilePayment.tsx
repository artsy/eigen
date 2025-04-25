import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { MyProfilePaymentDeleteCardMutation } from "__generated__/MyProfilePaymentDeleteCardMutation.graphql"
import { MyProfilePaymentQuery } from "__generated__/MyProfilePaymentQuery.graphql"
import { MyProfilePayment_me$data } from "__generated__/MyProfilePayment_me.graphql"
import { CreditCardDetailsContainer } from "app/Components/CreditCardDetails"
import { MenuItem } from "app/Components/MenuItem"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderText } from "app/utils/placeholders"
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

export let __triggerRefresh: null | (() => Promise<void>) = null

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

  // set up the global refresh hook. this one doesn't need to update the loading state
  useEffect(() => {
    const triggerRefresh = async () => {
      await new Promise((resolve) => {
        relay.refetchConnection(NUM_CARDS_TO_FETCH, resolve)
      })
    }
    __triggerRefresh = triggerRefresh
    return () => {
      if (__triggerRefresh === triggerRefresh) {
        __triggerRefresh = null
      }
    }
  }, [])

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
              <Button block onPress={() => navigate("/my-profile/payment/new-card")}>
                Add new card
              </Button>
              {!!isLoadingMore && <ActivityIndicator style={{ marginTop: 30 }} />}
            </Flex>
          }
        />
      </MyProfileScreenWrapper>
    )
  }

  return (
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
  )
}

export const MyProfilePaymentPlaceholder: React.FC<{}> = () => (
  <Flex px={2} py="15px">
    {times(2).map((index: number) => (
      <Flex key={index} py={1}>
        <PlaceholderText width={100 + Math.random() * 100} />
      </Flex>
    ))}
  </Flex>
)

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

const MyProfilePaymentSuspense: React.FC = () => {
  const data = useLazyLoadQuery<MyProfilePaymentQuery>(
    MyProfilePaymentScreenQuery,
    { count: NUM_CARDS_TO_FETCH },
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
