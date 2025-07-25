import {
  BellStrokeIcon,
  GroupIcon,
  HeartStrokeIcon,
  HelpIcon,
  InstitutionIcon,
  SettingsIcon,
  TrendingIcon,
} from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { CallapseWithTitle } from "app/Scenes/Favorites/Components/CollapseWithTitle"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import React, { useState } from "react"
import { Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ICON_SIZE = 18

const TitleWithIcon: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => {
  return (
    <Flex flexDirection="row">
      <Flex>{icon}</Flex>

      <Flex flex={1} ml={1}>
        <Text variant="sm-display">{title}</Text>
      </Flex>
    </Flex>
  )
}

const SECTIONS = [
  {
    title: "Saves",
    content: (
      <Flex>
        <Join separator={<Spacer y={1} />}>
          <TitleWithIcon
            icon={<HeartStrokeIcon />}
            title="Curate your own list of works you love"
          />
          <TitleWithIcon
            icon={<TrendingIcon />}
            title="Get better recommendations with every Save"
          />
          <TitleWithIcon
            icon={<InstitutionIcon />}
            title="Signal your interest to galleries and you could receiving an offer on your saved artwork from a gallery. Read more."
          />
        </Join>
      </Flex>
    ),
  },
  {
    title: "Follows",
    content: (
      <Flex>
        <Join separator={<Spacer y={1} />}>
          <TitleWithIcon
            icon={<GroupIcon />}
            title="Get updates on your favorite artists, including new artworks, shows, exhibitions and more."
          />
          <TitleWithIcon
            icon={<TrendingIcon />}
            title="Tailor your experience, helping you discover artworks that match your taste."
          />
          <TitleWithIcon
            icon={<BellStrokeIcon />}
            title="Never miss out by exploring your Activity and receiving timely email updates"
          />
        </Join>
      </Flex>
    ),
  },
  {
    title: "Alerts",
    content: (
      <Flex>
        <Join separator={<Spacer y={1} />}>
          <TitleWithIcon
            icon={<BellStrokeIcon />}
            title="If you’re on the hunt for a particular artwork, create an Alert and we’ll notify you when there’s a match."
          />
          <TitleWithIcon
            icon={<TrendingIcon />}
            title="Stay informed through emails, push notifications, or within Activity."
          />
          <TitleWithIcon
            icon={<SettingsIcon />}
            title="Customize Alerts to match your budget, preferred medium, rarity or other criteria."
          />
        </Join>
      </Flex>
    ),
  },
]

export const FavoritesLearnMore = () => {
  const activeTab = FavoritesContextStore.useStoreState((state) => state.activeTab)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const { bottom } = useSafeAreaInsets()
  const { trackTappedInfoBubble } = useFavoritesTracking()

  const { height } = Dimensions.get("screen")
  const SNAP_POINTS = [height * 0.8, height * 0.9]

  return (
    <>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Learn more about Favorites"
        onPress={() => {
          setShowBottomSheet(true)
          trackTappedInfoBubble(activeTab)
        }}
      >
        <HelpIcon height={ICON_SIZE} width={ICON_SIZE} hitSlop={DEFAULT_HIT_SLOP} />
      </Touchable>

      <AutomountedBottomSheetModal
        visible={showBottomSheet}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing
        onDismiss={() => {
          setShowBottomSheet(false)
        }}
        name="LearnMoreBottomSheet"
      >
        <BottomSheetScrollView>
          <Flex px={2} p={2}>
            <Text variant="lg-display">Learn more</Text>

            <Spacer y={2} />
          </Flex>

          <Join separator={<Spacer y={2} />}>
            {SECTIONS.map(({ title, content }) => {
              return (
                <CallapseWithTitle title={title} key={title}>
                  {content}
                </CallapseWithTitle>
              )
            })}
          </Join>

          {/* This is a spacer to make sure the bottom sheet is not covered by the system bottom insets */}
          <Spacer y={`${bottom}px`} />
        </BottomSheetScrollView>
      </AutomountedBottomSheetModal>
    </>
  )
}
