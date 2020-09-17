import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { ConsignmentsHome_targetSupply } from "__generated__/ConsignmentsHome_targetSupply.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Join, Separator } from "palette"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, ScrollView, ScrollViewProps } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtistListFragmentContainer as ArtistList } from "./Components/ArtistList"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySoldFragmentContainer as RecentlySold } from "./Components/RecentlySold"

interface Props {
  targetSupply: ConsignmentsHome_targetSupply
  isLoading?: boolean
}

export const ConsignmentsHome: React.FC<Props> = ({ targetSupply, isLoading }) => {
  const navRef = useRef<ScrollView>(null)
  const tracking = useTracking()

  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    if (navRef.current) {
      tracking.trackEvent(tappedConsign(tappedConsignArgs))
      const route = "/collections/my-collection/artworks/new/submissions/new"
      SwitchBoard.presentModalViewController(navRef.current, route)
    }
  }
  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex backgroundColor="white">
        <FancyModalHeader rightButtonText="Submit" onRightButtonPress={() => handleConsignPress({} as any)}>
          Sell your art
        </FancyModalHeader>
      </Flex>
    ),
    showAtScrollOffset: 200,
  })

  return (
    <>
      <ScrollView ref={navRef} {...scrollProps}>
        <Join separator={<Separator my={3} />}>
          <Header onConsignPress={handleConsignPress} />
          <RecentlySold targetSupply={targetSupply} isLoading={isLoading} />
          <HowItWorks />
          <ArtistList targetSupply={targetSupply} isLoading={isLoading} />
          <Footer onConsignPress={handleConsignPress} />
        </Join>
      </ScrollView>
      {headerElement}
    </>
  )
}

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  targetSupply: graphql`
    fragment ConsignmentsHome_targetSupply on TargetSupply {
      ...RecentlySold_targetSupply
      ...ArtistList_targetSupply
    }
  `,
})

interface ConsignmentsHomeQueryRendererProps {
  environment?: RelayModernEnvironment
}

export const ConsignmentsHomeQueryRenderer: React.FC<ConsignmentsHomeQueryRendererProps> = ({ environment }) => {
  return (
    <QueryRenderer<ConsignmentsHomeQuery>
      environment={environment || defaultEnvironment}
      variables={{}}
      query={graphql`
        query ConsignmentsHomeQuery {
          targetSupply {
            ...ConsignmentsHome_targetSupply
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ConsignmentsHomeContainer,
        renderPlaceholder: () => <ConsignmentsHome isLoading={true} targetSupply={null as any} />,
      })}
    />
  )
}

function useStickyScrollHeader({ header, showAtScrollOffset }: { header: JSX.Element; showAtScrollOffset: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const entrance = useRef(new Animated.Value(0)).current
  const headerElement = useMemo(
    () => (
      <Animated.View
        pointerEvents={isVisible ? undefined : "none"}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
      >
        {header}
      </Animated.View>
    ),
    [header, isVisible]
  )

  const onScroll = useCallback<NonNullable<ScrollViewProps["onScroll"]>>((e) => {
    setIsVisible(e.nativeEvent.contentOffset.y >= showAtScrollOffset)
  }, [])

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: isVisible ? 1 : 0,
      useNativeDriver: true,
      bounciness: -7,
      speed: 13,
    }).start()
  }, [isVisible])

  return {
    headerElement,
    scrollProps: {
      onScroll,
      scrollEventThreshold: 100,
    },
  }
}
