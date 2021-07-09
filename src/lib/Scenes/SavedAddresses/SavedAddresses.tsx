import { SavedAddresses_me } from "__generated__/SavedAddresses_me.graphql"
import { SavedAddressesQuery } from "__generated__/SavedAddressesQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Button, Flex, Text } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createRefetchContainer, QueryRenderer, RelayRefetchProp } from "react-relay"
import { graphql } from "relay-runtime"

const SavedAddresses: React.FC<{ me: SavedAddresses_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const addresses = extractNodes(me.addressConnection)
  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(
      {},
      null,
      () => {
        setIsRefreshing(false)
      },
      { force: true }
    )
  }, [])
  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={addresses}
        keyExtractor={(address) => address.internalID}
        contentContainerStyle={{ flexGrow: 0.8, paddingTop: addresses.length === 0 ? 10 : 20 }}
        renderItem={({ item }) => (
          <Flex py={3} px={2} alignItems="center">
            <Text>
              {item.name},{item.addressLine1},{item.city}
            </Text>
          </Flex>
        )}
        ListEmptyComponent={
          <Flex py={3} px={2} alignItems="center" height="100%" justifyContent="center">
            <Text variant="title" mb={2}>
              No Saved Addresses
            </Text>
            <Text variant="caption" textAlign="center" mb={3}>
              Please add an address for a faster checkout experience in the future.
            </Text>
            <Button block variant="primaryBlack" width={100}>
              Add New Address
            </Button>
          </Flex>
        }
      />
    </PageWithSimpleHeader>
  )
}

export const SavedAddressesPlaceholder: React.FC = () => {
  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <Flex px={2} py={15}>
        {times(2).map((index: number) => (
          <Flex key={index} py={1}>
            <PlaceholderText width={100 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  )
}

export const SavedAddressesContainer = createRefetchContainer(
  SavedAddresses,
  {
    me: graphql`
      fragment SavedAddresses_me on Me {
        name
        addressConnection(first: 3) {
          edges {
            node {
              internalID
              name
              addressLine1
              addressLine2
              addressLine3
              city
              region
              postalCode
            }
          }
        }
      }
    `,
  },
  graphql`
    query SavedAddressesRefetchQuery {
      me {
        ...SavedAddresses_me
      }
    }
  `
)

export const SavedAddressesQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<SavedAddressesQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedAddressesQuery {
          me {
            ...SavedAddresses_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: SavedAddressesContainer,
        renderPlaceholder: () => <SavedAddressesPlaceholder />,
      })}
      variables={{}}
      cacheConfig={{ force: true }}
    />
  )
}
