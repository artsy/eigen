import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Flex, Join, Separator } from "palette"
import { COVER_IMAGE_HEIGHT } from "./SaleCard"

export const MyBidsPlaceholder: React.FC = () => (
  <Flex pt="4" px="1">
    {/* navbar title */}
    <Flex alignItems="center">
      <PlaceholderText width={100} />
    </Flex>

    {/* tabs */}
    <Flex flexDirection="row">
      <Flex flex={1} alignItems="center">
        <PlaceholderText marginTop={20} width={80} />
      </Flex>

      <Flex flex={1} alignItems="center">
        <PlaceholderText marginTop={20} width={80} />
      </Flex>
    </Flex>

    <Separator mt={1} mb={2} />

    {/* registered sales */}
    <Flex px="1">
      <PlaceholderText marginTop={5} marginBottom={20} width={100 + Math.random() * 100} />

      <Flex flexDirection="row" pb={2}>
        {times(3).map((index) => (
          <Flex key={index} marginRight={2}>
            <PlaceholderBox height={COVER_IMAGE_HEIGHT} width="100%" />
            <PlaceholderText marginTop={10} width={40 + Math.random() * 80} />
            <PlaceholderText marginTop={5} width={40 + Math.random() * 80} />
          </Flex>
        ))}
      </Flex>
    </Flex>

    {/* your lots */}
    <Flex px="1">
      <PlaceholderText marginTop={10} width={80} />

      <Join separator={<Separator my={1} />}>
        {times(4).map((index) => (
          <Flex mt={1} key={index} flexDirection="row">
            <PlaceholderBox height={60} width={60} />

            <Flex ml={1} flex={1}>
              <PlaceholderText width={50 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={50 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={50 + Math.random() * 80} />
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              <PlaceholderText width={30 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={30 + Math.random() * 80} />
            </Flex>
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)
