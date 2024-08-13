import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { MyProfilePaymentDeleteCardMutation } from "__generated__/MyProfilePaymentDeleteCardMutation.graphql"
import { MyProfilePaymentQuery } from "__generated__/MyProfilePaymentQuery.graphql"
import { MyProfilePayment_me$data } from "__generated__/MyProfilePayment_me.graphql"
import { CreditCardDetailsContainer } from "app/Components/CreditCardDetails"
import { MenuItem } from "app/Components/MenuItem"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { times } from "lodash"
import React, { useCallback, useEffect, useReducer, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  LayoutAnimation,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import {
  commitMutation,
  createPaginationContainer,
  graphql,
  QueryRenderer,
  RelayPaginationProp,
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

  return (
    <PageWithSimpleHeader title="Payment">
      <FlatList
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={creditCards}
        keyExtractor={(item) => item.internalID}
        contentContainerStyle={{ paddingTop: creditCards.length === 0 ? 10 : 20 }}
        renderItem={({ item }) => (
          <Flex flexDirection="row" justifyContent="space-between" px={2}>
            <CreditCardDetailsContainer card={item} />
            {deletingIDs[item.internalID] ? (
              <ActivityIndicator size="small" />
            ) : (
              <TouchableOpacity
                onPress={() => onRemove(item.internalID)}
                hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
              >
                <Text variant="sm-display" color="red100">
                  Remove
                </Text>
              </TouchableOpacity>
            )}
          </Flex>
        )}
        onEndReached={onLoadMore}
        ItemSeparatorComponent={() => <Spacer y={1} />}
        ListFooterComponent={
          <Flex pt={creditCards.length === 0 ? undefined : 2}>
            <MenuItem
              title="Add New Card"
              onPress={() => navigate("/my-profile/payment/new-card")}
            />
            {!!isLoadingMore && <ActivityIndicator style={{ marginTop: 30 }} />}
          </Flex>
        }
      />
    </PageWithSimpleHeader>
  )
}

export const MyProfilePaymentPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Payment">
    <Flex px={2} py="15px">
      {times(2).map((index: number) => (
        <Flex key={index} py={1}>
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      ))}
    </Flex>
  </PageWithSimpleHeader>
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

export const MyProfilePaymentQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<MyProfilePaymentQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyProfilePaymentQuery($count: Int!) {
          me {
            ...MyProfilePayment_me @arguments(count: $count)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfilePaymentContainer,
        renderPlaceholder: () => <MyProfilePaymentPlaceholder />,
      })}
      variables={{ count: NUM_CARDS_TO_FETCH }}
      cacheConfig={{ force: true }}
    />
  )
}
