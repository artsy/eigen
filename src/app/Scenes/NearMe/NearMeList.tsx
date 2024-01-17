import { Flex, Image, Tabs, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { NearMeQuery$data } from "__generated__/NearMeQuery.graphql"
import { NearMe_showsConnection$key } from "__generated__/NearMe_showsConnection.graphql"
import { ShowsConnectionFragment } from "app/Scenes/NearMe/NearMe"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"

interface NearMeListProps {
  isMapViewEnabled: boolean
  setIsMapViewEnabled: (isMapViewEnabled: boolean) => void
  cityQueryData: NearMeQuery$data["city"]
}

export const NearMeList: React.FC<NearMeListProps> = ({
  isMapViewEnabled,
  setIsMapViewEnabled,
  cityQueryData,
}) => {
  const data = useFragment<NearMe_showsConnection$key>(ShowsConnectionFragment, cityQueryData)
  const { width } = useScreenDimensions()
  const space = useSpace()
  const shows = extractNodes(data?.showsConnection)

  console.warn({ shows })

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
                  <Text fontWeight="bold">{item?.name}</Text>
                  <Text>{item?.location?.address}</Text>
                </Flex>
              </TouchableOpacity>
            )
          }}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Fairs" label="Fairs">
        <Text>Shows</Text>
      </Tabs.Tab>
    </Tabs.TabsWithHeader>
  )
}
