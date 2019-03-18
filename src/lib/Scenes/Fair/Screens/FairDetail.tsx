import { Box, Message, Separator, Serif, Theme } from "@artsy/palette"
import { FairDetail_fair } from "__generated__/FairDetail_fair.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap, PartnerType } from "lib/Components/LocationMap"
import { PAGE_SIZE } from "lib/data/constants"
import { Schema, screenTrack, Track, track as _track } from "lib/utils/track"
import { ArtistsExhibitorsWorksLink } from "../Components/ArtistsExhibitorsWorksLink"
import { FairBoothPreviewContainer as FairBoothPreview } from "../Components/FairBoothPreview"
import { FairHeaderContainer as FairHeader } from "../Components/FairHeader"
import { SearchLink } from "../Components/SearchLink"
import { shouldShowFairBMWArtActivationLink } from "./FairBMWArtActivation"
import { shouldGoStraightToWebsite, shouldShowFairMoreInfo } from "./FairMoreInfo"

interface Props extends ViewProperties {
  fair: FairDetail_fair
  relay: RelayPaginationProp
}

interface State {
  sections: Array<{
    type: "hours" | "location"
    data: any
  }>
  boothCount: number
  extraData?: { animatedValue: { height: number } }
}
const track: Track<Props, State> = _track

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.id,
  context_screen_owner_id: props.fair._id,
}))
export class FairDetail extends React.Component<Props, State> {
  state: State = {
    sections: [],
    boothCount: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fair.shows.edges.length !== nextProps.fair.shows.edges.length) {
      this.updateSections()
    }
  }

  componentDidMount() {
    this.updateSections()
  }

  updateSections = () => {
    const { fair } = this.props
    const { is_active } = fair
    const sections = []

    const coords = fair.location.coordinates
    if (coords && coords.lat && coords.lng) {
      sections.push({
        type: "location",
        data: {
          location: fair.location,
          partnerName: fair.profile ? fair.profile.name : fair.name,
          partnerType: PartnerType.fair,
        },
      })
    }

    if (shouldGoStraightToWebsite(this.props.fair) || shouldShowFairMoreInfo(this.props.fair)) {
      sections.push({
        type: "information",
      })
    }

    if (shouldShowFairBMWArtActivationLink(this.props.fair)) {
      sections.push({
        type: "bmwArtActivation",
      })
    }
    if (fair.hours) {
      sections.push({
        type: "hours",
        data: fair.hours,
      })
    }

    let boothCount = 0

    if (is_active) {
      sections.push({
        type: "title",
      })
      sections.push({
        type: "artistsExhibitorsWorks",
        data: {
          fairID: fair.id,
        },
      })
      sections.push({
        type: "search",
        data: {
          id: fair.id,
          _id: fair._id,
        },
      })

      fair.shows.edges.forEach(showData => {
        const showArtworks = showData.node.artworks_connection
        if (showArtworks && showArtworks.edges.length) {
          sections.push({
            type: "booth",
            showIndex: boothCount,
            data: {
              show: showData.node,
            },
          })
          boothCount++
        }
      })
    } else {
      sections.push({
        type: "notActive",
      })
    }

    this.setState({ sections, boothCount })
  }

  @track(eventProps(Schema.ActionNames.ToggleHours))
  handleHoursToggled() {
    return null
  }

  onViewMoreInfoPressed = () => {
    if (shouldGoStraightToWebsite(this.props.fair)) {
      SwitchBoard.presentNavigationViewController(this, this.props.fair.organizer.website)
    } else {
      SwitchBoard.presentNavigationViewController(this, `/fair/${this.props.fair.id}/info`)
    }
  }

  onViewBMWArtActivationPressed = () => {
    SwitchBoard.presentNavigationViewController(this, `/fair/${this.props.fair.id}/bmw-sponsored-content`)
  }

  renderItem = ({ item: { data, type, showIndex } }) => {
    switch (type) {
      case "location":
        return <LocationMap partnerType="Fair" {...data} />
      case "hours":
        return (
          <>
            <HoursCollapsible openingHours={{ text: data }} onToggle={() => this.handleHoursToggled()} />
            <Separator mt={2} />
          </>
        )
      case "search":
        return <SearchLink {...data} />
      case "booth":
        const renderSeparator = this.state.boothCount - 1 > showIndex ? true : false
        return (
          <>
            <FairBoothPreview {...data} Component={this} />
            {renderSeparator && <Separator mt={2} />}
          </>
        )
      case "information":
        return (
          <>
            <CaretButton onPress={this.onViewMoreInfoPressed.bind(this)} text="View more information" />
            <Separator mt={2} />
          </>
        )
      case "artistsExhibitorsWorks":
        return <ArtistsExhibitorsWorksLink {...data} />
      case "title":
        return (
          <Box mt={1}>
            <Serif size={"6"}>Browse the fair</Serif>
          </Box>
        )
      case "bmwArtActivation":
        return (
          <>
            <CaretButton onPress={this.onViewBMWArtActivationPressed.bind(this)} text="BMW art activations" />
            <Separator mt={2} />
          </>
        )
      case "notActive":
        return (
          <Message textSize="3t">
            Check back closer to the fair for a first look at works for sale and to learn more about this year’s
            exhibiting galleries and artists.
          </Message>
        )
      default:
        return null
    }
  }

  fetchNextPage = () => {
    const { relay } = this.props

    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    relay.loadMore(PAGE_SIZE, error => {
      if (!error) {
        this.updateSections()
      }
    })
  }

  render() {
    const { fair } = this.props
    const { sections, extraData } = this.state

    return (
      <Theme>
        <FlatList
          keyExtractor={(item, index) => item.type + String(index)}
          extraData={extraData}
          data={sections}
          ListHeaderComponent={<FairHeader fair={fair} />}
          renderItem={item => (
            <Box px={2} pb={2}>
              {this.renderItem(item)}
            </Box>
          )}
          onEndReached={this.fetchNextPage}
          automaticallyAdjustContentInsets={false}
        />
      </Theme>
    )
  }
}

function eventProps(actionName: Schema.ActionNames, actionType: Schema.ActionTypes = Schema.ActionTypes.Tap) {
  return props => ({
    action_name: actionName,
    action_type: actionType,
    owner_id: props.fair._id,
    owner_slug: props.fair.id,
    owner_type: Schema.OwnerEntityTypes.Fair,
  })
}

export const FairDetailContainer = createPaginationContainer(
  FairDetail,
  {
    fair: graphql`
      fragment FairDetail_fair on Fair
        @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String" }) {
        ...FairHeader_fair
        id
        _id
        name
        hours
        is_active
        location {
          ...LocationMap_location
          coordinates {
            lat
            lng
          }
        }
        # so that we know whether to show more info
        organizer {
          website
        }
        about
        ticketsLink
        profile {
          name
        }
        sponsoredContent {
          activationText
          pressReleaseUrl
        }
        shows: shows_connection(first: $count, after: $cursor) @connection(key: "Fair_shows") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              _id
              artworks_connection(first: 4) {
                edges {
                  node {
                    id
                  }
                }
              }
              ...FairBoothPreview_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.fair && props.fair.shows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, { filter }) {
      return {
        id: props.fair.id,
        count,
        cursor,
        filter,
      }
    },
    query: graphql`
      query FairDetailShowsQuery($id: String!, $count: Int!, $cursor: String) {
        fair(id: $id) {
          ...FairDetail_fair @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
