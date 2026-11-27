import { Flex, Screen, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { ArtistCVListFairBoothsQuery } from "__generated__/ArtistCVListFairBoothsQuery.graphql"
import { ArtistCVListFairBooths_artist$key } from "__generated__/ArtistCVListFairBooths_artist.graphql"
import { ArtistCVListQuery } from "__generated__/ArtistCVListQuery.graphql"
import { ArtistCVList_artist$key } from "__generated__/ArtistCVList_artist.graphql"
import { ArtistCVRow } from "app/Scenes/ArtistCV/Components/ArtistCVRow"
import { CVKind, CV_KIND_LABELS } from "app/Scenes/ArtistCV/utils/cvKinds"
import { CVShow, toCVRows } from "app/Scenes/ArtistCV/utils/toCVRows"
import { extractNodes } from "app/utils/extractNodes"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { useMemo } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const PAGE_SIZE = 20

interface ArtistCVListProps {
  artistID: string
  kind: CVKind
}

// Fair booths have their own query: any soloShow value, null included, filters out solo booths.
export const ArtistCVList: React.FC<ArtistCVListProps> = ({ artistID, kind }) => {
  if (kind === "fair") {
    return <ArtistCVFairBoothsList artistID={artistID} />
  }

  return <ArtistCVShowsList artistID={artistID} kind={kind} />
}

const ArtistCVShowsList: React.FC<ArtistCVListProps> = ({ artistID, kind }) => {
  const queryData = useLazyLoadQuery<ArtistCVListQuery>(artistCVListQuery, {
    artistID,
    soloShow: kind === "solo",
  })

  const { data, refetch, ...pagination } = usePaginationFragment<
    ArtistCVListQuery,
    ArtistCVList_artist$key
  >(artistCVListFragment, queryData.artist)
  const refreshControl = useRefreshControl(refetch, { pageSize: PAGE_SIZE })

  return (
    <CVShowsList
      shows={extractNodes(data?.showsConnection)}
      label={CV_KIND_LABELS[kind]}
      refreshControl={refreshControl}
      {...pagination}
    />
  )
}

const ArtistCVFairBoothsList: React.FC<{ artistID: string }> = ({ artistID }) => {
  const queryData = useLazyLoadQuery<ArtistCVListFairBoothsQuery>(artistCVListFairBoothsQuery, {
    artistID,
  })

  const { data, refetch, ...pagination } = usePaginationFragment<
    ArtistCVListFairBoothsQuery,
    ArtistCVListFairBooths_artist$key
  >(artistCVListFairBoothsFragment, queryData.artist)
  const refreshControl = useRefreshControl(refetch, { pageSize: PAGE_SIZE })

  return (
    <CVShowsList
      shows={extractNodes(data?.showsConnection)}
      label={CV_KIND_LABELS.fair}
      refreshControl={refreshControl}
      {...pagination}
    />
  )
}

interface CVShowsListProps {
  shows: CVShow[]
  label: string
  hasNext: boolean
  isLoadingNext: boolean
  loadNext: (pageSize: number) => void
  refreshControl: React.JSX.Element
}

const CVShowsList: React.FC<CVShowsListProps> = ({
  shows,
  label,
  hasNext,
  isLoadingNext,
  loadNext,
  refreshControl,
}) => {
  const space = useSpace()

  const rows = useMemo(() => toCVRows(shows), [shows])

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(PAGE_SIZE)
  }

  // Screen's headers need Screen.FlatList (there's no SectionList), so years are rows.
  return (
    <Screen.FlatList
      data={rows}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: space(2) }}
      keyExtractor={(row) => (row.kind === "year" ? `year-${row.year}` : row.show.internalID)}
      renderItem={({ item }) =>
        item.kind === "year" ? (
          <Text variant="sm-display" accessibilityRole="header" mt={item.isFirst ? 0 : 3} mb={1}>
            {item.year}
          </Text>
        ) : (
          <ArtistCVRow show={item.show} />
        )
      }
      onEndReached={handleLoadMore}
      refreshControl={refreshControl}
      ListEmptyComponent={
        <Text variant="sm" color="mono60">
          This artist has no {label.toLowerCase()} yet.
        </Text>
      }
      ListFooterComponent={
        <Flex alignItems="center" my={2} style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}>
          <Spinner />
        </Flex>
      }
    />
  )
}

const artistCVListFragment = graphql`
  fragment ArtistCVList_artist on Artist
  @refetchable(queryName: "ArtistCVListPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
    soloShow: { type: "Boolean!" }
  ) {
    showsConnection(
      first: $count
      after: $cursor
      sort: START_AT_DESC
      atAFair: false
      soloShow: $soloShow
      isReference: true
      visibleToPublic: false
    ) @connection(key: "ArtistCVList_showsConnection") {
      edges {
        node {
          internalID
          slug
          href
          is_fair_booth: isFairBooth
          name
          startYear: startAt(format: "YYYY")
          partner {
            ... on Partner {
              name
            }
            ... on ExternalPartner {
              name
            }
          }
        }
      }
    }
  }
`

const artistCVListQuery = graphql`
  query ArtistCVListQuery($artistID: String!, $soloShow: Boolean!) {
    artist(id: $artistID) {
      ...ArtistCVList_artist @arguments(soloShow: $soloShow)
    }
  }
`

// Same show fields as ArtistCVList_artist; keep the two in sync.
const artistCVListFairBoothsFragment = graphql`
  fragment ArtistCVListFairBooths_artist on Artist
  @refetchable(queryName: "ArtistCVListFairBoothsPaginationQuery")
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    showsConnection(
      first: $count
      after: $cursor
      sort: START_AT_DESC
      atAFair: true
      isReference: true
      visibleToPublic: false
    ) @connection(key: "ArtistCVListFairBooths_showsConnection") {
      edges {
        node {
          internalID
          slug
          href
          is_fair_booth: isFairBooth
          name
          startYear: startAt(format: "YYYY")
          partner {
            ... on Partner {
              name
            }
            ... on ExternalPartner {
              name
            }
          }
        }
      }
    }
  }
`

const artistCVListFairBoothsQuery = graphql`
  query ArtistCVListFairBoothsQuery($artistID: String!) {
    artist(id: $artistID) {
      ...ArtistCVListFairBooths_artist
    }
  }
`
