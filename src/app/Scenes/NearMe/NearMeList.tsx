import {
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Tabs,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { NearMeQuery$data } from "__generated__/NearMeQuery.graphql"
import { NearMe_fairsConnection$key } from "__generated__/NearMe_fairsConnection.graphql"
import { NearMe_showsConnection$key } from "__generated__/NearMe_showsConnection.graphql"
import { FairsConnectionFragment, ShowsConnectionFragment } from "app/Scenes/NearMe/NearMe"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"

interface NearMeListProps {
  isMapViewEnabled: boolean
  setIsMapViewEnabled: (isMapViewEnabled: boolean) => void
  cityQueryData: NearMeQuery$data
  setIsFilterModalVisible: (isFilterModalVisible: boolean) => void
  setSelectedCitySlug: (selectedCitySlug: string | null) => void
}

const HEADER_HEIGHT = 50

const SaveIcon: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false)

  if (isSaved) {
    return (
      <TouchableOpacity onPress={() => setIsSaved(false)}>
        <Flex justifySelf="center">
          <HeartFillIcon accessibilityLabel="Saved icon" fill="blue100" />
        </Flex>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={() => setIsSaved(true)}>
      <Flex justifySelf="center">
        <HeartIcon accessibilityLabel="Save icon" />
      </Flex>
    </TouchableOpacity>
  )
}

export const NearMeList: React.FC<NearMeListProps> = ({
  isMapViewEnabled,
  setIsMapViewEnabled,
  setIsFilterModalVisible,
  cityQueryData,
}) => {
  const showData = useFragment<NearMe_showsConnection$key>(ShowsConnectionFragment, cityQueryData)
  const fairData = useFragment<NearMe_fairsConnection$key>(FairsConnectionFragment, cityQueryData)
  const { width } = useScreenDimensions()
  const space = useSpace()
  const shows = extractNodes(showData?.city?.showsConnection)
  const fairs = extractNodes(fairData?.city?.fairsConnection)

  return (
    <Tabs.TabsWithHeader
      initialTabName="Shows"
      title="Near me"
      headerProps={{
        onBack: goBack,
        rightElements: isMapViewEnabled ? (
          <TouchableOpacity onPress={() => setIsMapViewEnabled(false)}>
            <Text>List</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsMapViewEnabled(true)}>
            <Text>Map</Text>
          </TouchableOpacity>
        ),
      }}
      showLargeHeaderText
    >
      <Tabs.Tab name="Shows" label="Shows">
        <Tabs.FlatList
          keyExtractor={(item) => item?.id}
          data={shows}
          contentContainerStyle={{ padding: space(2) }}
          ListHeaderComponentStyle={{ zIndex: 1 }}
          ListHeaderComponent={
            <>
              <Tabs.SubTabBar>
                <Flex backgroundColor="white100">
                  <Flex
                    flexDirection="row"
                    height={HEADER_HEIGHT}
                    px={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
                      <Text>Filter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsMapViewEnabled(true)}>
                      <Text>Show Map</Text>
                    </TouchableOpacity>
                  </Flex>
                </Flex>
              </Tabs.SubTabBar>
            </>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigate(`/show/${item.slug}`)}>
                <Flex py={2}>
                  {!!item.metaImage?.url && (
                    <Image
                      src={item.metaImage?.url}
                      aspectRatio={item?.metaImage?.aspectRatio ?? 1}
                      width={width - space(4)}
                      height={100}
                      style={{ margin: "auto" }}
                    />
                  )}
                  <Flex py={2} flexDirection="row" justifyContent="space-between">
                    <Flex>
                      <Text fontWeight="bold">{item?.name}</Text>
                      <Text>{item?.location?.address}</Text>
                    </Flex>
                    <SaveIcon />
                  </Flex>
                </Flex>
              </TouchableOpacity>
            )
          }}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Fairs" label="Fairs">
        <Tabs.FlatList
          keyExtractor={(item) => item?.id}
          data={fairs}
          contentContainerStyle={{ padding: space(2) }}
          ListEmptyComponent={
            <Flex flex={1} pt={6} alignItems="center">
              <Text>No active fairs around you at the moment</Text>
            </Flex>
          }
          ListHeaderComponentStyle={{ zIndex: 1 }}
          ListHeaderComponent={
            <>
              <Tabs.SubTabBar>
                <Flex backgroundColor="white100">
                  <Flex
                    flexDirection="row"
                    height={HEADER_HEIGHT}
                    px={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
                      <Text>Filter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsMapViewEnabled(true)}>
                      <Text>Show Map</Text>
                    </TouchableOpacity>
                  </Flex>
                </Flex>
              </Tabs.SubTabBar>
            </>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigate(`/show/${item.slug}`)}>
                <Flex py={2}>
                  {!!item.image?.imageURL && (
                    <Image
                      src={item.image?.imageURL}
                      aspectRatio={item?.image?.aspectRatio ?? 1}
                      width={width - space(4)}
                      height={100}
                      style={{ margin: "auto" }}
                    />
                  )}
                  <Text fontWeight="bold">{item?.name}</Text>
                  <Text>{item?.location?.address}</Text>
                </Flex>
              </TouchableOpacity>
            )
          }}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Saved" label="Saved">
        <Tabs.FlatList
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={
            <Flex flex={1} pt={6} marginX={2} alignItems="center">
              <Text textAlign="center">
                You haven't saved anything yet, here you can see your saved shows galleries and
                fairs!
              </Text>
            </Flex>
          }
        />
      </Tabs.Tab>
    </Tabs.TabsWithHeader>
  )
}
