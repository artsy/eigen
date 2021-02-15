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
import { Box, Button, Sans } from "palette"
import React from "react"
import { Dimensions, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
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
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

  get commonPadding(): number {
    return isPad ? 40 : 20
  }

  /** Top of the Component */
  renderForeground = () => {
    const containerStyle = {
      backgroundColor: "white",
      paddingLeft: this.commonPadding,
      paddingRight: this.commonPadding,
      marginBottom: 10,
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

  @track((props) => ({
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      aggregations: this.props.gene.artworks.aggregations,
    }

    const currentSettings = {
      sort: this.state.sort,
      selectedMedium: this.state.selectedMedium,
      selectedPrice: this.state.selectedPriceRange,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      aggregations: this.props.gene.artworks.aggregations,
    }

    // We're returning the promise so that it's easier
    // to write tests with the resolved state
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return Refine.triggerRefine(this, initialSettings, currentSettings).then((newSettings) => {
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

  /**  Count of the works, and the refine button - sticks to the top of screen when scrolling */
  renderStickyRefineSection = () => {
    const separatorColor = this.state.showingStickyHeader ? "white" : colors["gray-regular"]

    const refineButtonWidth = 80
    const maxLabelWidth = Dimensions.get("window").width - this.commonPadding * 2 - refineButtonWidth - 10

    return (
      <Box backgroundColor="white" paddingTop={15}>
        <Separator style={{ backgroundColor: separatorColor }} />
        <View style={styles.refineContainer}>
          <Sans size="3t" color="black60" maxWidth={maxLabelWidth}>
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
                    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                    connection={this.props.gene.artworks}
                    hasMore={this.props.relay.hasMore}
                    loadMore={this.props.relay.loadMore}
                    HeaderComponent={this.renderStickyRefineSection()}
                    stickyHeaderIndices={[0]}
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
            </View>
          }
        />
      </View>
    )
  }

  /** The summary string of the current refine settings */
  artworkQuerySummaryString = () => {
    const items: string[] = []
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const works = this.props.gene.artworks.counts.total.toLocaleString()
    items.push(`${works} works`)

    if (this.state.selectedMedium !== "*") {
      items.push(_.startCase(this.state.selectedMedium))
    }
    if (this.state.selectedPriceRange !== "*-*") {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    width: isPad ? 330 : null,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

export const GeneQueryRenderer: React.FC<GeneQueryRendererProps> = ({ geneID, medium, price_range }) => {
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
