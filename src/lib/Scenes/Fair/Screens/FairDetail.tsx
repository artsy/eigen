import { Box, Separator, Serif, Theme } from "@artsy/palette"
import { FairDetail_fair } from "__generated__/FairDetail_fair.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap, PartnerType } from "lib/Components/LocationMap"
import { PAGE_SIZE } from "lib/data/constants"
import { ArtistsExhibitorsWorksLink } from "../Components/ArtistsExhibitorsWorksLink"
import { FairBoothPreviewContainer as FairBoothPreview } from "../Components/FairBoothPreview"
import { FairHeaderContainer as FairHeader } from "../Components/FairHeader"
import { SearchLink } from "../Components/SearchLink"

interface Props extends ViewProperties {
  fair: FairDetail_fair
  relay: RelayPaginationProp
  onViewMoreInfoPressed: () => void
  onViewAllArtworksPressed: () => void
  onViewAllExhibitorsPressed: () => void
  onViewAllArtistsPressed: () => void
  onViewFairBoothPressed: (props: object) => void
}

interface State {
  sections: Array<{
    type: "hours" | "location"
    data: any
  }>
  extraData?: { animatedValue: { height: number } }
}

export class FairDetail extends React.Component<Props, State> {
  state: State = {
    sections: [],
  }

  boothCount = 0

  componentWillReceiveProps({ fair }: Props) {
    if (this.boothCount !== fair.shows.edges.length) {
      this.updateSections()
    }
  }

  componentDidMount() {
    this.updateSections()
  }

  updateSections = () => {
    const {
      fair,
      onViewAllExhibitorsPressed,
      onViewAllArtworksPressed,
      onViewAllArtistsPressed,
      onViewFairBoothPressed,
      onViewMoreInfoPressed,
    } = this.props
    const sections = []

    const coords = fair.location.coordinates
    if (coords && coords.lat && coords.lng) {
      sections.push({
        type: "location",
        data: {
          location: fair.location,
          partnerName: fair.profile.name,
          partnerType: PartnerType.fair,
        },
      })
    }

    sections.push({
      type: "information",
      data: {
        onViewMoreInfoPressed: () => onViewMoreInfoPressed(),
      },
    })

    if (fair.hours) {
      sections.push({
        type: "hours",
        data: {
          hours: fair.hours,
        },
      })
    }

    sections.push({
      type: "title",
    })

    sections.push({
      type: "artists-exhibitors-works",
      data: {
        onViewAllExhibitorsPressed,
        onViewAllArtistsPressed,
        onViewAllArtworksPressed,
      },
    })

    sections.push({
      type: "search",
      data: {
        fairID: fair.id,
      },
    })

    fair.shows.edges.forEach(showData => {
      const showArtworks = showData.node.artworks_connection
      if (showArtworks && showArtworks.edges.length) {
        sections.push({
          type: "booth",
          showIndex: this.boothCount,
          data: {
            show: showData.node,
            onViewFairBoothPressed: () => onViewFairBoothPressed({ show: showData.node }),
          },
        })
        this.boothCount++
      }
    })

    this.setState({ sections })
  }

  renderItem = ({ item: { data, type, showIndex } }) => {
    switch (type) {
      case "location":
        return <LocationMap partnerType="Fair" {...data} />
      case "hours":
        return (
          <>
            <HoursCollapsible {...data} onAnimationFrame={this.handleAnimationFrame} />
            <Separator mt={2} />
          </>
        )
      case "search":
        return <SearchLink {...data} />
      case "booth":
        const renderSeparator = showIndex < this.boothCount ? true : false
        return (
          <>
            <FairBoothPreview {...data} Component={this} />
            {renderSeparator && <Separator mt={2} />}
          </>
        )
      case "information":
        return (
          <>
            <CaretButton onPress={() => data.onViewMoreInfoPressed()} text="View more information" />
            <Separator mt={2} />
          </>
        )
      case "artists-exhibitors-works":
        return <ArtistsExhibitorsWorksLink {...data} />
      case "title":
        return (
          <Box mt={1}>
            <Serif size={"6"}>Browse the fair</Serif>
          </Box>
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

  handleAnimationFrame = animatedValue => {
    /**
     * If children change their size on animation (e.g. HoursCollapsible), we need a sentinel value
     * in state in order to trigger a re-render, as FlatList statically sizes child cells.
     */
    this.setState({
      extraData: {
        ...this.state.extraData,
        animatedValue,
      },
    })
  }

  render() {
    const { fair, onViewAllExhibitorsPressed, onViewAllArtistsPressed } = this.props
    const { sections, extraData } = this.state

    return (
      <Theme>
        <FlatList
          keyExtractor={(item, index) => item.type + String(index)}
          extraData={extraData}
          data={sections}
          ListHeaderComponent={
            <FairHeader
              fair={fair}
              viewAllExhibitors={onViewAllExhibitorsPressed}
              viewAllArtists={onViewAllArtistsPressed}
            />
          }
          renderItem={item => (
            <Box px={2} py={1}>
              {this.renderItem(item)}
            </Box>
          )}
          onEndReached={this.fetchNextPage}
        />
      </Theme>
    )
  }
}

export const FairDetailContainer = createPaginationContainer(
  FairDetail,
  {
    fair: graphql`
      fragment FairDetail_fair on Fair
        @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String" }) {
        ...FairHeader_fair
        id
        name
        hours
        location {
          ...LocationMap_location
          coordinates {
            lat
            lng
          }
        }

        profile {
          name
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
