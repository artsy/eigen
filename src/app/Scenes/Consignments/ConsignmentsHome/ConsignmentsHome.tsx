import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { ConsignmentsHome_targetSupply } from "__generated__/ConsignmentsHome_targetSupply.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Join, Separator } from "palette"
import { useEffect } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
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
  const tracking = useTracking()
  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    tracking.trackEvent(tappedConsign(tappedConsignArgs))
    GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
      photos: [],
    })
    const route = "/collections/my-collection/artworks/new/submissions/new"
    navigate(route)
  }

  useEffect(() => {
    return () => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
        photos: [],
      })
    }
  }, [])

  return (
    <ScrollView>
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

export const ConsignmentsHomeQueryRenderer: React.FC<ConsignmentsHomeQueryRendererProps> = ({
  environment,
}) => {
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
        renderPlaceholder: () => <ConsignmentsHome isLoading targetSupply={null as any} />,
      })}
    />
  )
}
