import { Flex, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { CitiesFilterModalFragment$key } from "__generated__/CitiesFilterModalFragment.graphql"
import { NearMeQuery$data } from "__generated__/NearMeQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Modal } from "react-native"
import { graphql, useFragment } from "react-relay"

interface CitiesFilterModalProps {
  setIsFilterModalVisible: (isFilterModalVisible: boolean) => void
  queryData: NearMeQuery$data
}

export const CitiesFilterModal: React.FC<CitiesFilterModalProps> = ({
  setIsFilterModalVisible,
  queryData,
}) => {
  const data = useFragment<CitiesFilterModalFragment$key>(citiesFilterModalFragment, queryData)

  console.warn({ data })

  return (
    <Modal>
      <Screen>
        <FancyModalHeader onLeftButtonPress={() => setIsFilterModalVisible(false)} />
        <Flex flex={1}>
          <Flex alignItems="center">
            <Text>filter modal</Text>
          </Flex>
          <Spacer y={2} />
          {data.cities.map((city) => (
            <Flex
              key={city.slug}
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text>{city.name}</Text>
              <Text>{city.showsConnection?.totalCount}</Text>
            </Flex>
          ))}
        </Flex>
      </Screen>
    </Modal>
  )
}

const citiesFilterModalFragment = graphql`
  fragment CitiesFilterModalFragment on Query {
    cities(featured: true) {
      name
      slug
      showsConnection(first: 0, status: RUNNING_AND_UPCOMING) {
        totalCount
      }
      coordinates {
        lat
        lng
      }
    }
  }
`
