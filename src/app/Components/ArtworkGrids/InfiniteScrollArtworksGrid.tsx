// 1. Get first layout pass of grid view so we have a total width and calculate the column width (componentDidMount?).
// 2. Possibly do artwork column layout now, as we can do so based just on the aspect ratio, assuming the text height
//    won't be too different between artworks.
// 3. Get artwork heights by either:
//    - calculating the item size upfront with aspect ratio and a static height for the text labels.
//    - leting the artwork component do a layout pass and calculate its own height based on the column width.
// 4. Update height of grid to encompass all items.

import { ScreenOwnerType } from "@artsy/cohesion"
import { Box, Flex } from "@artsy/palette-mobile"
import { InfiniteScrollArtworksGrid_connection$data } from "__generated__/InfiniteScrollArtworksGrid_connection.graphql"
import { InfiniteScrollArtworksGrid_myCollectionConnection$data } from "__generated__/InfiniteScrollArtworksGrid_myCollectionConnection.graphql"
import ParentAwareScrollView from "app/Components/ParentAwareScrollView"
import { PAGE_SIZE } from "app/Components/constants"
import { MyCollectionArtworkGridItemFragmentContainer } from "app/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkGridItem"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Button, Spinner } from "palette"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"
import { createFragmentContainer, RelayPaginationProp } from "react-relay"
import { graphql } from "relay-runtime"
import Artwork, { ArtworkProps } from "./ArtworkGridItem"

/**
 * TODO:
 * - currently all the code assumes column layout
 *   - do no invert aspect ratios in row layout
 * - deal with edge-cases when calculating in which section an artwork should go
 *   - see ARMasonryCollectionViewLayout for details on how to deal with last works sticking out
 *   - the calculation currently only takes into account the size of the image, not if e.g. the sale message is present
 */

export interface Props {
  /** The direction for the grid, currently only 'column' is supported . */
  sectionDirection?: string

  /** The arity of the number of sections (e.g. columns) to show */
  sectionCount?: number

  /** The inset margin for the whole grid */
  sectionMargin?: number

  /** The per-item margin */
  itemMargin?: number

  /** A component to render at the top of all items */
  HeaderComponent?: React.ComponentType<any> | React.ReactElement<any>

  /** A component to render at the bottom of all items */
  FooterComponent?: React.ComponentType<any> | React.ReactElement<any>

  /** Pass true if artworks should have a Box wrapper with gutter padding */
  shouldAddPadding?: boolean

  /** Defaults to true, pass false to enable fetching more artworks via pressing "Show More" button instead of on scroll */
  autoFetch?: boolean

  /** Number of items to fetch in pagination request. Default is 10 */
  pageSize?: number

  /** Parent screen where the grid is located. For analytics purposes. */
  contextScreenOwnerType?: ScreenOwnerType

  /** Id of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenOwnerId?: string

  /** Slug of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenOwnerSlug?: string

  /** Search query of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenQuery?: string

  /** Name of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreen?: string

  /** Allow users to save artworks that are not lots to their saves & follows */
  hideSaveIcon?: boolean

  /** An array of child indices determining which children get docked to the top of the screen when scrolling.  */
  stickyHeaderIndices?: number[]

  // Hide urgency tags (3 Days left, 1 hour left)
  hideUrgencyTags?: boolean

  // Hide Partner name
  hidePartner?: boolean

  itemComponentProps?: Partial<ArtworkProps>

  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
  /** Show Lot Label  */
  showLotLabel?: boolean

  /** To avoid layout jank, supply the width of the grid ahead of time. */
  width?: number

  /** Allows to use MyCollectionArtworkGridItem */
  isMyCollection?: boolean

  /** Whether to use `ParentAwareScrollView` or `ScrollView`
   * (defaults to true on android, undefined on iOS )
   */
  useParentAwareScrollView?: boolean

  /** Wether to show a loading spinner (defaults to false) */
  showLoadingSpinner?: boolean

  /** Whether to add the tapped artwork to recent searches */
  updateRecentSearchesOnTap?: boolean

  localSortAndFilterArtworks?: (artworks: any[]) => any[]

  refreshControl?: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >
}

interface PrivateProps {
  connection:
    | InfiniteScrollArtworksGrid_connection$data
    | InfiniteScrollArtworksGrid_myCollectionConnection$data
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
  isLoading?: RelayPaginationProp["isLoading"]
}

interface MapperProps extends Omit<PrivateProps, "connection"> {
  connection?: InfiniteScrollArtworksGrid_connection$data | null
  myCollectionConnection?: InfiniteScrollArtworksGrid_myCollectionConnection$data
}

const InfiniteScrollArtworksGridMapper: React.FC<MapperProps & Omit<Props, "isMyCollection">> = ({
  connection,
  myCollectionConnection,
  loadMore,
  hasMore,
  ...otherProps
}) => {
  const theConnectionProp = !!connection ? connection : myCollectionConnection
  type TheConnectionType<T> = T extends InfiniteScrollArtworksGrid_connection$data
    ? InfiniteScrollArtworksGrid_connection$data
    : InfiniteScrollArtworksGrid_myCollectionConnection$data
  const isMyCollection = !!myCollectionConnection && !connection

  if (!theConnectionProp) {
    throw new Error("No connection prop supplied to InfiniteScrollArtworksGrid")
  }
  return (
    <InfiniteScrollArtworksGrid
      loadMore={loadMore}
      hasMore={hasMore}
      connection={theConnectionProp as TheConnectionType<typeof theConnectionProp>}
      isMyCollection={isMyCollection}
      {...otherProps}
    />
  )
}

export const DEFAULT_SECTION_MARGIN = 20
export const DEFAULT_ITEM_MARGIN = 20

const InfiniteScrollArtworksGrid: React.FC<Props & PrivateProps> = ({
  sectionCount = Dimensions.get("window").width > 700 ? 3 : 2,
  sectionMargin = DEFAULT_SECTION_MARGIN,
  itemMargin = DEFAULT_ITEM_MARGIN,
  shouldAddPadding = false,
  autoFetch = true,
  pageSize = PAGE_SIZE,
  hidePartner = false,
  isMyCollection = false,
  useParentAwareScrollView = Platform.OS === "android",
  showLoadingSpinner = false,
  hideSaveIcon = false,
  updateRecentSearchesOnTap = false,
  itemComponentProps,
  width,
  hasMore,
  isLoading,
  loadMore,
  connection,
  localSortAndFilterArtworks,
  HeaderComponent,
  FooterComponent,
  stickyHeaderIndices,
  onScroll,
  scrollEventThrottle,
  showLotLabel,
  hideUrgencyTags,
  contextScreen,
  contextScreenQuery,
  contextScreenOwnerSlug,
  contextScreenOwnerId,
  contextScreenOwnerType,
  refreshControl,
}) => {
  const artworks = extractNodes(connection)

  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })

  const getSectionDimension = (gridWidth: number | null | undefined) => {
    // Setting the dimension to 1 for tests to avoid adjusting the screen width
    if (__TEST__) {
      return 1
    }

    if (gridWidth) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
      const sectionMargins = sectionMargin! * (sectionCount! - 1)
      const artworkPadding = shouldAddPadding ? 40 : 0

      return (gridWidth - sectionMargins - artworkPadding) / sectionCount!
    }
    return 0
  }

  const [localIsLoading, setLocalIsLoading] = useState(false)
  const [sectionDimension, setSectionDimension] = useState(getSectionDimension(width))

  const fetchNextPage = () => {
    if (!hasMore() || localIsLoading || isLoading?.()) {
      return
    }

    setLocalIsLoading(true)

    loadMore(pageSize!, (error) => {
      setLocalIsLoading(false)
      if (error) {
        // FIXME: Handle error
        console.error("InfiniteScrollGrid.tsx", error.message)
      }
    })
  }

  const handleFetchNextPageOnScroll = isCloseToBottom(fetchNextPage)

  const onLayout = (event: LayoutChangeEvent) => {
    setSectionDimension(getSectionDimension(event.nativeEvent.layout.width))
  }

  const getSectionedArtworks = () => {
    const sectionRatioSums: number[] = []
    const sectionedArtworksArray: Array<typeof artworks> = []
    const columnCount = sectionCount ?? 0

    for (let i = 0; i < columnCount; i++) {
      sectionedArtworksArray.push([])
      sectionRatioSums.push(0)
    }

    const preprocessedArtworks =
      (localSortAndFilterArtworks?.(artworks) as typeof artworks) ?? artworks

    preprocessedArtworks.forEach((artwork) => {
      // There are artworks without images and other ‘issues’. Like Force we’re just going to reject those for now.
      // See: https://github.com/artsy/eigen/issues/1667
      //
      // Exception: Allow artworks without images for MyCollection
      if (artwork.image || isMyCollection) {
        // Find section with lowest *inverted* aspect ratio sum, which is the shortest column.
        let lowestRatioSum = Number.MAX_VALUE // Start higher, so we always find a
        let sectionIndex: number | null = null
        for (let j = 0; j < sectionRatioSums.length; j++) {
          const ratioSum = sectionRatioSums[j]
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j
            lowestRatioSum = ratioSum
          }
        }

        if (sectionIndex != null) {
          const section = sectionedArtworksArray[sectionIndex]
          section.push(artwork)

          // Keep track of total section aspect ratio
          const aspectRatio = artwork.image?.aspectRatio || 1 // Ensure we never divide by null/0
          // Invert the aspect ratio so that a lower value means a shorter section.
          sectionRatioSums[sectionIndex] += 1 / aspectRatio
        }
      }
    })

    return sectionedArtworksArray
  }

  const renderSections = () => {
    const spacerStyle = {
      height: itemMargin,
    }

    const artworks = extractNodes(connection)
    const sectionedArtworks = getSectionedArtworks()
    const sections: JSX.Element[] = []
    const columnCount = sectionCount ?? 0
    for (let column = 0; column < columnCount; column++) {
      const artworkComponents: JSX.Element[] = []
      for (let row = 0; row < sectionedArtworks[column].length; row++) {
        const artwork = sectionedArtworks[column][row]
        const itemIndex = row * columnCount + column

        const componentSpecificProps = isMyCollection
          ? {}
          : {
              hideSaveIcon,
            }
        const ItemComponent = isMyCollection
          ? MyCollectionArtworkGridItemFragmentContainer
          : Artwork

        const aspectRatio = artwork.image?.aspectRatio ?? 1
        const imgWidth = sectionDimension
        const imgHeight = imgWidth / aspectRatio
        artworkComponents.push(
          <ItemComponent
            contextScreenOwnerType={contextScreenOwnerType}
            contextScreenOwnerId={contextScreenOwnerId}
            contextScreenOwnerSlug={contextScreenOwnerSlug}
            contextScreenQuery={contextScreenQuery}
            contextScreen={contextScreen}
            artwork={artwork as any} // FIXME: Types are messed up here
            key={"artwork-" + itemIndex + "-" + artwork.id}
            hideUrgencyTags={hideUrgencyTags}
            hidePartner={hidePartner}
            showLotLabel={showLotLabel}
            itemIndex={itemIndex}
            updateRecentSearchesOnTap={updateRecentSearchesOnTap}
            navigateToPageableRoute={navigateToPageableRoute}
            {...itemComponentProps}
            height={imgHeight}
            {...componentSpecificProps}
          />
        )
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (row < artworks.length - 1) {
          artworkComponents.push(
            <View
              style={spacerStyle}
              key={"spacer-" + row + "-" + artwork.id}
              accessibilityLabel="Spacer View"
            />
          )
        }
      }

      const sectionSpecificStyle = {
        width: sectionDimension,
        marginRight: column === columnCount - 1 ? 0 : sectionMargin,
      }

      sections.push(
        <View
          style={[styles.section, sectionSpecificStyle]}
          key={column}
          accessibilityLabel={"Section " + column}
        >
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  const renderHeader = () => {
    if (!HeaderComponent) {
      return null
    }

    return React.isValidElement(HeaderComponent) ? HeaderComponent : <HeaderComponent />
  }

  const renderFooter = () => {
    if (!FooterComponent) {
      return null
    }

    return React.isValidElement(FooterComponent) ? FooterComponent : <FooterComponent />
  }

  const renderedArtworks = sectionDimension ? renderSections() : null

  const boxPadding = shouldAddPadding ? 2 : 0

  const ScrollViewWrapper = !!useParentAwareScrollView ? ParentAwareScrollView : ScrollView

  return (
    <>
      <ScrollViewWrapper
        onScroll={(ev) => {
          onScroll?.(ev)
          if (autoFetch) {
            handleFetchNextPageOnScroll(ev)
          }
        }}
        refreshControl={refreshControl}
        scrollEventThrottle={scrollEventThrottle ?? 50}
        onLayout={onLayout}
        scrollsToTop={false}
        accessibilityLabel="Artworks ScrollView"
        stickyHeaderIndices={stickyHeaderIndices}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {renderHeader()}
        <Box px={boxPadding}>
          <View style={styles.container} accessibilityLabel="Artworks Content View">
            {renderedArtworks}
          </View>
        </Box>

        {!autoFetch && !!hasMore() && (
          <Button
            mt={6}
            mb={4}
            variant="fillGray"
            size="large"
            block
            onPress={fetchNextPage}
            loading={localIsLoading}
          >
            Show more
          </Button>
        )}
        {!!showLoadingSpinner && !!localIsLoading && (
          <Flex mt={2} mb={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        )}
      </ScrollViewWrapper>

      {!!localIsLoading && hasMore() && (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={4}
          pb={6}
          style={{ opacity: localIsLoading && hasMore() ? 1 : 0 }}
        >
          {!!autoFetch && (
            <ActivityIndicator color={Platform.OS === "android" ? "black" : undefined} />
          )}
        </Flex>
      )}

      {renderFooter()}
    </>
  )
}

interface Styles {
  container: ViewStyle
  section: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
  },
  section: {
    flex: 1,
    flexDirection: "column",
  },
})

export const InfiniteScrollArtworksGridContainer = createFragmentContainer(
  InfiniteScrollArtworksGridMapper,
  {
    connection: graphql`
      fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface
      @argumentDefinitions(skipMyCollection: { type: "Boolean", defaultValue: true }) {
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          node {
            slug
            id
            image(includeAll: false) {
              aspectRatio
            }
            ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            ...MyCollectionArtworkGridItem_artwork
              @skip(if: $skipMyCollection)
              @arguments(includeAllImages: false)
          }
        }
      }
    `,
  }
)

/** Same as InfiniteScrollArtworksGridContainer but for MyCollection Artworks */
export const InfiniteScrollMyCollectionArtworksGridContainer = createFragmentContainer(
  InfiniteScrollArtworksGridMapper,
  {
    myCollectionConnection: graphql`
      fragment InfiniteScrollArtworksGrid_myCollectionConnection on MyCollectionConnection
      @argumentDefinitions(skipArtworkGridItem: { type: "Boolean", defaultValue: true }) {
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          node {
            title
            slug
            id
            image(includeAll: true) {
              aspectRatio
            }
            artistNames
            medium
            artist {
              internalID
              name
            }
            pricePaid {
              minor
            }
            sizeBucket
            width
            height
            date
            ...MyCollectionArtworks_filterProps @relay(mask: false)
            ...ArtworkGridItem_artwork
              @skip(if: $skipArtworkGridItem)
              @arguments(includeAllImages: true)
            ...MyCollectionArtworkGridItem_artwork @arguments(includeAllImages: true)
          }
        }
      }
    `,
  }
)
