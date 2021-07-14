import { captureMessage } from "@sentry/react-native"
import { SavedAddresses_me } from "__generated__/SavedAddresses_me.graphql"
import { SavedAddressesDeleteUserAddressMutation } from "__generated__/SavedAddressesDeleteUserAddressMutation.graphql"
import { SavedAddressesQuery } from "__generated__/SavedAddressesQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Button, color, Flex, Separator, Spacer, Text, Touchable } from "palette"
import React, { useCallback, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createRefetchContainer, QueryRenderer, RelayRefetchProp } from "react-relay"
import { commitMutation, graphql } from "relay-runtime"
import styled from "styled-components/native"

interface CardProps {
  isDefault: boolean
}

const Card = styled(Flex)`
  border: 1px solid ${(props: CardProps) => (props.isDefault ? color("black100") : color("black30"))};
  border-radius: 4;
`

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

  const onPressDeleteAddress = (addressId: string) => {
    deleteUserAddress(
      addressId,
      () =>
        relay.refetch({
          first: 3,
        }),
      (message: string) => captureMessage(message)
    )
  }

  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={addresses.sort((a, b) => Number(b?.isDefault) - Number(a?.isDefault))}
        keyExtractor={(address) => address.internalID}
        contentContainerStyle={{
          paddingTop: addresses.length === 0 ? 10 : 40,
          flexGrow: 0.8,
        }}
        renderItem={({ item }) => (
          <>
            <Card mx={2} py={2} px={16} isDefault={item.isDefault}>
              <Text fontSize={16} lineHeight={24}>
                {item.name}
              </Text>
              <Text fontSize={16} lineHeight={24} color="black60">
                {[item.addressLine1, item?.addressLine2, item?.addressLine3].filter(Boolean).join(", ")}
              </Text>
              <Text fontSize={16} lineHeight={24} color="black60">
                {item.city}, {item.postalCode}
              </Text>
              <Spacer height={10} />
              <Text variant="text" color="black60">
                {item?.phoneNumber}
              </Text>
              <Separator my={2} />
              <Flex flexDirection="row">
                <Flex flex={1} justifyContent="center">
                  {!!item?.isDefault && <Text variant="small">Default Address</Text>}
                </Flex>
                <Flex flex={1} flexDirection="row" justifyContent="space-between">
                  <Touchable onPress={onPressEditAddress}>
                    <Text variant="text" color="black100" style={{ textDecorationLine: "underline" }}>
                      Edit
                    </Text>
                  </Touchable>
                  <Touchable onPress={() => onPressDeleteAddress(item.internalID)}>
                    <Text variant="text" color="red100" style={{ textDecorationLine: "underline" }}>
                      Delete
                    </Text>
                  </Touchable>
                </Flex>
              </Flex>
            </Card>
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
              isDefault
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

const deleteUserAddress = (userAddressID: string, onSuccess: () => void, onError: (message: string) => void) => {
  commitMutation<SavedAddressesDeleteUserAddressMutation>(defaultEnvironment, {
    variables: {
      input: {
        userAddressID,
      },
    },
    mutation: graphql`
      mutation SavedAddressesDeleteUserAddressMutation($input: DeleteUserAddressInput!) {
        deleteUserAddress(input: $input) {
          userAddressOrErrors {
            ... on UserAddress {
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
              isDefault
            }
            ... on Errors {
              errors {
                code
                message
              }
            }
          }
        }
      }
    `,
    onError: (e) => {
      onError(e.message)
    },
    onCompleted: (data) => {
      const errors = data?.deleteUserAddress?.userAddressOrErrors.errors
      if (errors) {
        onError(errors.map((error) => error.message).join(", "))
      } else {
        onSuccess()
      }
    },
  })
}

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
