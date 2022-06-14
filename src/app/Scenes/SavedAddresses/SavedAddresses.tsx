import { captureMessage } from "@sentry/react-native"
import { themeGet } from "@styled-system/theme-get"
import { SavedAddresses_me$data } from "__generated__/SavedAddresses_me.graphql"
import { SavedAddressesQuery } from "__generated__/SavedAddressesQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { navigate, navigationEvents } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Box, Flex, Separator, Spacer, Text, Touchable } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { createRefetchContainer, QueryRenderer, RelayRefetchProp } from "react-relay"
import { graphql } from "relay-runtime"
import styled from "styled-components/native"
import { AddAddressButton } from "./Components/AddAddressButton"
import { deleteSavedAddress } from "./mutations/deleteSavedAddress"

interface CardProps {
  isDefault: boolean
}

const Card = styled(Flex)`
  border: 1px solid
    ${(props: CardProps) =>
      props.isDefault ? themeGet("colors.black100") : themeGet("colors.black30")};
  border-radius: 4;
`

// tslint:disable-next-line:variable-name
const NUM_ADDRESSES_TO_FETCH = 10

// tslint:disable-next-line:no-empty
export const util = { onRefresh: () => {} }

const SavedAddresses: React.FC<{ me: SavedAddresses_me$data; relay: RelayRefetchProp }> = ({
  me,
  relay,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const toast = useToast()

  const addresses = extractNodes(me.addressConnection)
  util.onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(
      {},
      { first: NUM_ADDRESSES_TO_FETCH },
      () => {
        setIsRefreshing(false)
      },
      { force: true }
    )
  }, [])

  useEffect(() => {
    navigationEvents.addListener("goBack", util.onRefresh)
    return () => {
      navigationEvents.removeListener("goBack", util.onRefresh)
    }
  }, [])

  const onPressEditAddress = (addressId: string) =>
    navigate("/my-profile/saved-addresses/edit-address", {
      modal: true,
      passProps: {
        addressId,
      },
    })

  const onPressDeleteAddress = (addressId: string) => {
    deleteSavedAddress(
      addressId,
      () => {
        toast.show("Address successfully deleted", "top")
        relay.refetch(
          {},
          { first: NUM_ADDRESSES_TO_FETCH },
          () => {
            setIsRefreshing(false)
          },
          { force: true }
        )
      },
      (message: string) => captureMessage(message)
    )
  }

  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={util.onRefresh} />}
        data={addresses.sort((a, b) => Number(b?.isDefault) - Number(a?.isDefault))}
        keyExtractor={(address) => address.internalID}
        contentContainerStyle={{
          paddingTop: addresses.length === 0 ? 10 : 40,
          flexGrow: 0.8,
        }}
        renderItem={({ item }) => (
          <>
            <Flex mx={2}>
              <Card py={2} px={16} isDefault={item.isDefault}>
                <Text fontSize={16} lineHeight={24}>
                  {item.name}
                </Text>
                <Text fontSize={16} lineHeight={24} color="black60">
                  {[item.addressLine1, item?.addressLine2, item?.addressLine3]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                <Text fontSize={16} lineHeight={24} color="black60">
                  {item.city}, {item.postalCode}
                </Text>
                <Spacer height={10} />
                <Text variant="sm" color="black60">
                  {item?.phoneNumber}
                </Text>
                <Separator my={2} />
                <Flex flexDirection="row">
                  <Flex flex={1} justifyContent="center">
                    {!!item?.isDefault && <Text variant="xs">Default Address</Text>}
                  </Flex>
                  <Flex flex={1} flexDirection="row" justifyContent="space-between">
                    <Touchable
                      testID={`EditAddress-${item.internalID}`}
                      onPress={() => onPressEditAddress(item.internalID)}
                    >
                      <Text
                        variant="sm"
                        color="black100"
                        style={{ textDecorationLine: "underline" }}
                      >
                        Edit
                      </Text>
                    </Touchable>
                    <Touchable onPress={() => onPressDeleteAddress(item.internalID)}>
                      <Text variant="sm" color="red100" style={{ textDecorationLine: "underline" }}>
                        Delete
                      </Text>
                    </Touchable>
                  </Flex>
                </Flex>
              </Card>
            </Flex>

            <Spacer height={40} />
          </>
        )}
        ListFooterComponent={
          addresses.length ? (
            <Box mx={2} mb={2}>
              <AddAddressButton
                block={false}
                variant="outline"
                handleOnPress={() =>
                  navigate("/my-profile/saved-addresses/new-address", { modal: true })
                }
                title="Add New Address"
              />
            </Box>
          ) : (
            <></>
          )
        }
        ListEmptyComponent={
          <Flex py={3} px={2} alignItems="center" height="100%" justifyContent="center">
            <Text variant="md" mb={2}>
              No Saved Addresses
            </Text>
            <Text variant="xs" textAlign="center" mb={3}>
              Please add an address for a faster checkout experience in the future.
            </Text>
            <AddAddressButton
              handleOnPress={() =>
                navigate("/my-profile/saved-addresses/new-address", { modal: true })
              }
              title="Add New Address"
            />
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
        addressConnection(first: 10) {
          edges {
            node {
              id
              internalID
              name
              addressLine1
              addressLine2
              addressLine3
              country
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
