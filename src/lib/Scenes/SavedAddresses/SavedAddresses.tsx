import { SavedAddresses_me } from "__generated__/SavedAddresses_me.graphql"
import { SavedAddressesQuery } from "__generated__/SavedAddressesQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Button, color, Flex, Separator, Spacer, Text, Touchable } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl, StyleSheet } from "react-native"
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

  const onPressEditAddress = () => null

  const onPressDeleteAddress = () => null

  // formats address address to be
  // addressLine1, addressLine2, addressline3
  // and avoids rendering null text + extra commas
  const addressFormatter = (addressLine1: string, addressLine2: string | null, addressLine3: string | null) => {
    const COMMA_SEPARATOR = ", "
    const address1 = addressLine1 + COMMA_SEPARATOR
    const address2 = !addressLine2 ? "" : addressLine2 + COMMA_SEPARATOR
    const address3 = !addressLine3 ? "" : addressLine3 + COMMA_SEPARATOR
    return address1 + address2 + address3
  }

  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={addresses}
        keyExtractor={(address) => address.internalID}
        contentContainerStyle={{
          paddingTop: addresses.length === 0 ? 10 : 40,
          flexGrow: 0.8,
        }}
        renderItem={({ item }) => (
          <>
            <Flex key={item.id} mx={2} py={2} px={16} style={styles.card}>
              <Text fontSize={16} lineHeight={24}>
                {item.name}
              </Text>
              <Text fontSize={16} lineHeight={24} color={color("black60")}>
                {addressFormatter(item.addressLine1, item.addressLine2, item.addressLine3)}
              </Text>
              <Text fontSize={16} lineHeight={24} color={color("black60")}>
                {`${item.city}, ${item.postalCode}`}
              </Text>
              <Spacer height={10} />
              <Text variant="text" color={color("black60")}>
                {item?.phoneNumber}
              </Text>
              <Flex mr={14}>
                <Spacer height={20} />
                <Separator />
                <Spacer height={20} />
              </Flex>
              <Flex flexDirection="row">
                <Flex flex={1} justifyContent="center">
                  {/* TODO next task add default address label here */}
                  {/* <Text variant="small">Default Address</Text> */}
                </Flex>
                <Flex flex={1} flexDirection="row" justifyContent="space-between">
                  <Touchable onPress={onPressEditAddress}>
                    <Text variant="text" color="black100" style={{ textDecorationLine: "underline" }}>
                      Edit
                    </Text>
                  </Touchable>
                  <Touchable onPress={onPressDeleteAddress}>
                    <Text variant="text" color="red100" style={{ textDecorationLine: "underline" }}>
                      Delete
                    </Text>
                  </Touchable>
                </Flex>
              </Flex>
            </Flex>
            <Spacer height={40} />
          </>
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

const styles = StyleSheet.create({
  card: {
    borderColor: color("black30"),
    borderRadius: 4,
    borderWidth: 1,
  },
})

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
              id
              internalID
              name
              addressLine1
              addressLine2
              addressLine3
              city
              region
              postalCode
              phoneNumber
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
