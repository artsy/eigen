import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import { ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { MaxBidScreen, MaxBidScreenProps } from "../Components/Bidding/Screens/SelectMaxBid"

import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { BidFlow_sale_artwork } from "__generated__/BidFlow_sale_artwork.graphql"
import { BidFlowQuery } from "__generated__/BidFlowQuery.graphql"
import { SelectMaxBid_me } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { BidResultScreen } from "lib/Components/Bidding/Screens/BidResult"
import { CreditCardForm } from "lib/Components/Bidding/Screens/CreditCardForm"
import { SelectMaxBidEdit } from "lib/Components/Bidding/Screens/SelectMaxBidEdit"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { BidFlow_me } from "../../__generated__/BidFlow_me.graphql"
import { ConfirmBidScreen } from "../Components/Bidding/Screens/ConfirmBid/index"

interface BidFlowProps extends ViewProperties {
  sale_artwork: BidFlow_sale_artwork
  me: BidFlow_me
}

// See src/lib/Scenes/MyCollection/Screens/ArtworkFormModal/MyCollectionArtworkFormModal.tsx
// tslint:disable-next-line:interface-over-type-literal
export type BidFlowStackProps = {
  MaxBidScreen: MaxBidScreenProps
  ConfirmBidScreen: any
  CreditCardForm: any
  SelectMaxBidEdit: any
  BidResultScreen: any
}

const Stack = createStackNavigator<BidFlowStackProps>()

// const BidFlow: React.FC<BidFlowProps> = (props) => {
//   return (
//     <TimeOffsetProvider>
//       <NavigatorIOS
//         navigationBarHidden={true}
//         initialRoute={{
//           component: MaxBidScreen,
//           title: "", // title is required, though we don't use it because our navigation bar is hidden.
//           passProps: props,
//         }}
//         style={{ flex: 1 }}
//       />
//     </TimeOffsetProvider>
//   )
// }

export const BidFlow: React.FC<BidFlowProps> = (props) => {
  const MaxBidStackScreen = (navProps: StackScreenProps<BidFlowStackProps, "MaxBidScreen">) => (
    <MaxBidScreen sale_artwork={props.sale_artwork} {...navProps} />
  )

  const ConfirmBidScreenStackScreen = (navProps: StackScreenProps<BidFlowStackProps, "ConfirmBidScreen">) => (
    <ConfirmBidScreen sale_artwork={props.sale_artwork} me={props.me} {...navProps} />
  )

  const CreditCardFormStackScreen = (navProps: StackScreenProps<BidFlowStackProps, "CreditCardForm">) => (
    <CreditCardForm {...navProps} />
  )

  const SelectMaxBidEditStackScreen = (navProps: StackScreenProps<BidFlowStackProps, "CreditCardForm">) => (
    <SelectMaxBidEdit {...navProps} />
  )

  const BidResultScreenStackScreen = (navProps: StackScreenProps<BidFlowStackProps, "BidResultScreen">) => (
    <BidResultScreen sale_artwork={props.sale_artwork} {...navProps} />
  )

  return (
    <NavigationContainer>
      <TimeOffsetProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
            cardStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen
            name="MaxBidScreen"
            component={MaxBidStackScreen}
            // initialParams={{ sale_artwork: props.sale_artwork, me: props.me }}
          />
          <Stack.Screen name="ConfirmBidScreen" component={ConfirmBidScreenStackScreen} />
          <Stack.Screen name="CreditCardForm" component={CreditCardFormStackScreen} />
          <Stack.Screen name="BidResultScreen" component={BidResultScreenStackScreen} />
          <Stack.Screen name="SelectMaxBidEdit" component={SelectMaxBidEditStackScreen} />
        </Stack.Navigator>
        {/* <NavigatorIOS
          navigationBarHidden={true}
          initialRoute={{
            component: MaxBidScreen,
            title: "", // title is required, though we don't use it because our navigation bar is hidden.
            passProps: props,
          }}
          style={{ flex: 1 }}
        /> */}
      </TimeOffsetProvider>
    </NavigationContainer>
  )
}

export const BidFlowFragmentContainer = createFragmentContainer(BidFlow, {
  sale_artwork: graphql`
    fragment BidFlow_sale_artwork on SaleArtwork {
      ...SelectMaxBid_sale_artwork
      ...ConfirmBid_sale_artwork
      ...BidResult_sale_artwork
    }
  `,
  me: graphql`
    fragment BidFlow_me on Me {
      ...ConfirmBid_me
    }
  `,
})

export const BidFlowQueryRenderer: React.FC<{ artworkID?: string; saleID: string }> = ({ artworkID, saleID }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <QueryRenderer<BidFlowQuery>
      environment={defaultEnvironment}
      query={graphql`
        query BidFlowQuery($artworkID: String!, $saleID: String!) {
          artwork(id: $artworkID) {
            sale_artwork: saleArtwork(saleID: $saleID) {
              ...BidFlow_sale_artwork
            }
          }
          me {
            ...BidFlow_me
          }
        }
      `}
      cacheConfig={{ force: true }} // We want to always fetch latest bid increments.
      variables={{
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        artworkID,
        saleID,
      }}
      render={renderWithLoadProgress<BidFlowQuery["response"]>((props) => (
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        <BidFlowFragmentContainer sale_artwork={props.artwork.sale_artwork} me={props.me} />
      ))}
    />
  )
}
