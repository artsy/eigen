import { Box, Button, Sans } from "@artsy/palette"
import { Gene_gene } from "__generated__/Gene_gene.graphql"
import { GeneQuery } from "__generated__/GeneQuery.graphql"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { StickyTabPageTabBar } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import colors from "lib/data/colors"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, Track, track as _track } from "lib/utils/track"
import * as _ from "lodash"
import React from "react"
import { Dimensions, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import ParallaxScrollView from "react-native-parallax-scroll-view"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "../Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import About from "../Components/Gene/About"
import Header from "../Components/Gene/Header"
import Separator from "../Components/Separator"
import * as Refine from "../NativeModules/triggerRefine"

const isPad = Dimensions.get("window").width > 700

const TABS = {
  WORKS: "Works",
  ABOUT: "About",
}

/** The title of the gene when scrolled, with margins */
const HeaderHeight = 64

interface Props extends ViewProperties {
  medium: string
  price_range: string
  gene: Gene_gene
  relay: RelayPaginationProp
}

interface State {
  selectedTabIndex: number
  showingStickyHeader?: boolean
  sort?: string
  selectedMedium?: string
  selectedPriceRange?: string
}
// @ts-ignore STRICTNESS_MIGRATION
const track: Track<Props, State> = _track

/**
 *  There are 3 different major views inside this componentDidUpdate
 *
 *   - Foreground [title, follow, switch]
 *   - Sticky Refine [work counter, refine]
 *   - Section inside tab [artworks || about + related artists]
 *
 *   Nuance:
 *
 *   - The foreground switches between the "foreground" and "sticky header"
 *     the foreground being the title, buttons and switch, the header being
 *     just the title. It only does this for Artworks, not about.
 *
 *   - The sticky refine, when scrolled up _gains_ a 64px margin
 *     this is so it can reach all the way of the screen, and fit
 *     the sticky header's mini title inside it.
 *
 *   - We use a fork of react-native-parallax-scroll-view which has access
 *     to change the style component of the header, as well as a well-ordered
 *     API for inserting a component into the tree. This is used so that the
 *     sticky refine section will _always_ be at a specific index, making sure
 *     the `stickyHeaderIndices` is always at the right index.
 *
 */
@track()
export class Gene extends React.Component<Props, State> {
  foregroundHeight: number = 220

  constructor(props: Props) {
    super(props)
    this.state = {
      selectedTabIndex: 0,
      showingStickyHeader: true,

      // Use the metaphysics defaults for refine settings
      sort: "-partner_updated_at",
      selectedMedium: this.props.medium || "*",
      selectedPriceRange: this.props.price_range || "*-*",
    }

    this.switchSelectionDidChange = this.switchSelectionDidChange.bind(this)
  }

  @track((props, state) => ({
    action_name: state.selectedTabIndex ? Schema.ActionNames.GeneWorks : Schema.ActionNames.GeneAbout,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.id,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  switchSelectionDidChange(index: number) {
    this.setState({ selectedTabIndex: index })
  }

  availableTabs = () => {
    return [TABS.WORKS, TABS.ABOUT]
  }

  selectedTabTitle = () => {
    return this.availableTabs()[this.state.selectedTabIndex]
  }

  renderSectionForTab = () => {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT:
        return <About gene={this.props.gene} />
      case TABS.WORKS:
        return (
          <InfiniteScrollArtworksGrid
            // @ts-ignore STRICTNESS_MIGRATION
            connection={this.props.gene.artworks}
            loadMore={this.props.relay.loadMore}
            hasMore={this.props.relay.hasMore}
            isLoading={this.props.relay.isLoading}
          />
        )
    }
  }

  get commonPadding(): number {
    return isPad ? 40 : 20
  }

  get showingArtworksSection(): boolean {
    return this.selectedTabTitle() === TABS.WORKS
  }

  /** Top of the Component */
  renderForeground = () => {
    const containerStyle = {
      backgroundColor: "white",
      paddingLeft: this.commonPadding,
      paddingRight: this.commonPadding,
    }
    return (
      <View style={styles.header}>
        <View style={[containerStyle]}>
          <Header gene={this.props.gene} shortForm={false} />
        </View>
      </View>
    )
  }

  /** Callback from the parallax that we have transistioned into the small title mode */
  onChangeHeaderVisibility = (sticky: boolean) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  /**  No sticky header if you're in the about section */
  stickyHeaderHeight(): number | null {
    if (!this.showingArtworksSection) {
      return null
    }
    return HeaderHeight
  }

  @track(props => ({
    action_name: Schema.ActionNames.Refine,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene.internalID,
    owner_slug: props.gene.id,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  refineTapped() {
    const initialSettings = {
      sort: "-partner_updated_at",
      selectedMedium: this.props.medium || "*",
      selectedPrice: this.props.price_range || "*-*",
      // @ts-ignore STRICTNESS_MIGRATION
      aggregations: this.props.gene.artworks.aggregations,
    }

    const currentSettings = {
      sort: this.state.sort,
      selectedMedium: this.state.selectedMedium,
      selectedPrice: this.state.selectedPriceRange,
      // @ts-ignore STRICTNESS_MIGRATION
      aggregations: this.props.gene.artworks.aggregations,
    }

    // We're returning the promise so that it's easier
    // to write tests with the resolved state
    // @ts-ignore STRICTNESS_MIGRATION
    return Refine.triggerRefine(this, initialSettings, currentSettings).then(newSettings => {
      if (newSettings) {
        this.setState({
          selectedMedium: newSettings.medium,
          selectedPriceRange: newSettings.selectedPrice,
          sort: newSettings.sort,
        })

        this.props.relay.refetchConnection(10, undefined, {
          medium: newSettings.medium,
          price_range: newSettings.selectedPrice,
          sort: newSettings.sort,
        })
      }
    })
  }

  /** Title of the Gene */
  renderStickyHeader = () => {
    if (!this.showingArtworksSection) {
      return null
    }
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: "white" }}>
        <Header gene={this.props.gene} shortForm={true} />
      </View>
    )
  }

  /**  Count of the works, and the refine button - sticks to the top of screen when scrolling */
  renderStickyRefineSection = () => {
    if (!this.showingArtworksSection) {
      return null
    }
    // const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight
    const separatorColor = this.state.showingStickyHeader ? "white" : colors["gray-regular"]

    const refineButtonWidth = 80
    const maxLabelWidth = Dimensions.get("window").width - this.commonPadding * 2 - refineButtonWidth - 10

    return (
      <Box backgroundColor="white" paddingLeft={this.commonPadding} paddingRight={this.commonPadding} paddingTop={15}>
        <Separator style={{ backgroundColor: separatorColor }} />
        <View style={styles.refineContainer}>
          <Sans size="3t" color="black60" maxWidth={maxLabelWidth} marginTop="2px">
            {this.artworkQuerySummaryString()}
          </Sans>
          <Button variant="secondaryOutline" onPress={() => this.refineTapped()} size="small">
            Refine
          </Button>
        </View>
        <Separator style={{ backgroundColor: separatorColor }} />
      </Box>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StickyTabPage
          tabs={[
            {
              title: TABS.WORKS,
              content: (
                <StickyTabPageScrollView disableScrollViewPanResponder>
                  <InfiniteScrollArtworksGrid
                    // @ts-ignore STRICTNESS_MIGRATION
                    connection={this.props.gene.artworks}
                    hasMore={this.props.relay.hasMore}
                    isLoading={this.props.relay.isLoading}
                    loadMore={this.props.relay.loadMore}
                  />
                </StickyTabPageScrollView>
              ),
              initial: true,
            },
            {
              title: TABS.ABOUT,
              content: <About gene={this.props.gene} />,
            },
          ]}
          // staticHeaderContent={<></>}
          staticHeaderContent={<>{this.renderForeground()}</>}
          stickyHeaderContent={
            <View>
              <StickyTabPageTabBar
                onTabPress={({ index }) => {
                  this.switchSelectionDidChange(index)
                }}
              />
              {this.renderStickyRefineSection()}
            </View>
          }
        />
      </View>
    )
  }

  /** The summary string of the current refine settings */
  artworkQuerySummaryString = () => {
    const items: string[] = []
    // @ts-ignore STRICTNESS_MIGRATION
    const works = this.props.gene.artworks.counts.total.toLocaleString()
    items.push(`${works} works`)

    if (this.state.selectedMedium !== "*") {
      items.push(_.startCase(this.state.selectedMedium))
    }
    if (this.state.selectedPriceRange !== "*-*") {
      // @ts-ignore STRICTNESS_MIGRATION
      items.push(this.priceRangeToHumanReadableString(this.state.selectedPriceRange))
    }
    return items.join(" ・ ")
  }

  /** Converts a price string like 30.00-5000.00 to $30 - $5,000 */
  priceRangeToHumanReadableString = (range: string) => {
    const dollars = (value: string) => {
      return parseInt(value, 10).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      })
    }

    if (range === "*-*") {
      return ""
    }
    if (range.includes("-*")) {
      const below = dollars(range.split("-*")[0])
      return `Above ${below}`
    }
    if (range.includes("*-")) {
      // @ts-ignore STRICTNESS_MIGRATION
      const below = dollars(range.split("*-").pop())
      return `Below ${below}`
    }
    const [first, second] = range.split("-")
    return `${dollars(first)} - ${dollars(second)}`
  }
}

interface Styles {
  header: ViewStyle
  stickyHeader: ViewStyle
  refineContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  header: {
    // @ts-ignore STRICTNESS_MIGRATION
    width: isPad ? 330 : null,
    // @ts-ignore STRICTNESS_MIGRATION
    alignSelf: isPad ? "center" : null,
  },
  stickyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // height: 26,
    // marginTop: 12,
    marginBottom: 12,
    paddingLeft: isPad ? 40 : 20,
    paddingRight: isPad ? 40 : 20,
  },
  refineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 26,
    marginBottom: 12,
  },
})

export const GeneFragmentContainer = createPaginationContainer(
  Gene,
  {
    gene: graphql`
      fragment Gene_gene on Gene
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
          sort: { type: "String", defaultValue: "-partner_updated_at" }
          medium: { type: "String", defaultValue: "*" }
          priceRange: { type: "String", defaultValue: "*-*" }
        ) {
        id
        internalID
        ...Header_gene
        ...About_gene
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          medium: $medium
          priceRange: $price_range
          sort: $sort
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
          forSale: true
        ) @connection(key: "Gene_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
            }
          }
          # TODO: Just to satisfy relay-compiler
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.gene.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.gene.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query GenePaginationQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $price_range: String
      ) {
        node(id: $id) {
          ... on Gene {
            ...Gene_gene
              @arguments(count: $count, cursor: $cursor, sort: $sort, medium: $medium, priceRange: $price_range)
          }
        }
      }
    `,
  }
)

interface GeneQueryRendererProps {
  geneID: string
  medium?: string
  price_range?: string
}

export const GeneQueryRenderer: React.SFC<GeneQueryRendererProps> = ({ geneID, medium, price_range }) => {
  return (
    <QueryRenderer<GeneQuery>
      environment={defaultEnvironment}
      query={graphql`
        query GeneQuery($geneID: String!, $medium: String, $price_range: String) {
          gene(id: $geneID) {
            ...Gene_gene @arguments(medium: $medium, priceRange: $price_range)
          }
        }
      `}
      variables={{
        geneID,
        medium,
        price_range,
      }}
      render={renderWithLoadProgress(GeneFragmentContainer)}
    />
  )
}
