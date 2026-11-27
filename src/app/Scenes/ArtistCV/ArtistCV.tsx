import {
  Flex,
  Pill,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { ArtistCVQuery } from "__generated__/ArtistCVQuery.graphql"
import { ArtistCVList } from "app/Scenes/ArtistCV/Components/ArtistCVList"
import { CVKind, CV_KIND_LABELS, CV_KIND_ORDER } from "app/Scenes/ArtistCV/utils/cvKinds"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { times } from "lodash"
import { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArtistCVProps {
  artistID: string
}

const ArtistCV: React.FC<ArtistCVProps> = ({ artistID }) => {
  const [kind, setKind] = useState<CVKind>("solo")

  return (
    <Screen>
      {/* Non-animated fallback, as in CardsWithMetaDataListPlaceholder: an animated header in a
      fallback can keep suspense from resolving. */}
      <Suspense fallback={<Screen.Header onBack={goBack} title="" />}>
        <ArtistCVHeader artistID={artistID} kind={kind} onSelectKind={setKind} />
      </Suspense>

      <Screen.Body fullwidth>
        <Suspense fallback={<ArtistCVListPlaceholder />}>
          <ArtistCVList artistID={artistID} kind={kind} />
        </Suspense>
      </Screen.Body>
    </Screen>
  )
}

interface ArtistCVHeaderProps {
  artistID: string
  kind: CVKind
  onSelectKind: (kind: CVKind) => void
}

const ArtistCVHeader: React.FC<ArtistCVHeaderProps> = ({ artistID, kind, onSelectKind }) => {
  const data = useLazyLoadQuery<ArtistCVQuery>(ArtistCVScreenQuery, { artistID })

  const title = data.artist?.name ? `${data.artist.name} CV` : "CV"

  return (
    <>
      <Screen.AnimatedHeader onBack={goBack} title={title} />
      <Screen.StickySubHeader title={title} separatorComponent={null}>
        <Flex flexDirection="row" px={2} mb={2}>
          {CV_KIND_ORDER.map((cvKind) => (
            <Pill
              key={cvKind}
              variant="default"
              mr={0.5}
              selected={kind === cvKind}
              onPress={() => onSelectKind(cvKind)}
            >
              {CV_KIND_LABELS[cvKind]}
            </Pill>
          ))}
        </Flex>
      </Screen.StickySubHeader>
    </>
  )
}

export const ArtistCVScreenQuery = graphql`
  query ArtistCVQuery($artistID: String!) {
    artist(id: $artistID) @principalField {
      name
    }
  }
`

export const ArtistCVQueryRenderer: React.FC<ArtistCVProps> = ({ artistID }) => {
  const enableArtistStory = useFeatureFlag("AREnableArtistStory")

  // Before this route, /artist/:artistID/cv opened the artist screen, and links still arrive here
  useEffect(() => {
    if (!enableArtistStory) {
      navigate(`/artist/${artistID}`, { replaceActiveScreen: true })
    }
  }, [enableArtistStory, artistID])

  if (!enableArtistStory) {
    return null
  }

  return <ArtistCV artistID={artistID} />
}

const ArtistCVListPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex px={2} testID="artist-cv-list-placeholder">
        {times(3).map((yearIndex) => (
          <Flex key={yearIndex} mb={4}>
            <SkeletonBox width={50} height={20} />
            <Spacer y={1} />
            {times(3).map((showIndex) => (
              <Flex key={showIndex} pl={2} mb={1}>
                <SkeletonText variant="sm">Example show name</SkeletonText>
                <SkeletonText variant="xs">Example gallery</SkeletonText>
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
    </Skeleton>
  )
}
