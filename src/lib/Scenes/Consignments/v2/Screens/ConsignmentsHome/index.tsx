import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { Join, Separator } from "@artsy/palette"
import { ConsignmentsHome_targetSupply } from "__generated__/ConsignmentsHome_targetSupply.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
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

  return (
    <ScrollView ref={navRef}>
      <Join separator={<Separator my={3} />}>
        <Header onConsignPress={handleConsignPress} />
        <RecentlySold targetSupply={targetSupply} isLoading={isLoading} />
        <HowItWorks />
        <ArtistList targetSupply={targetSupply} isLoading={isLoading} />
        <Footer onConsignPress={handleConsignPress} />
      </Join>
    </ScrollView>
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
