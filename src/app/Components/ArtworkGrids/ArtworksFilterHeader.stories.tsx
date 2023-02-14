import { Flex } from "@artsy/palette-mobile"
import { DecoratorFunction } from "@storybook/addons"
import { storiesOf } from "@storybook/react-native"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { withHooks } from "storybook/decorators"
import { ArtworksFilterHeader } from "./ArtworksFilterHeader"

export const withFilterProvider: DecoratorFunction<React.ReactNode> = (story) => (
  <ArtworkFiltersStoreProvider>{story()}</ArtworkFiltersStoreProvider>
)

storiesOf("ArtworkFilterHeader", module)
  .addDecorator(withHooks)
  .addDecorator(withFilterProvider)
  .add("Regular", () => {
    const selectedFiltersCount = useSelectedFiltersCount()
    return (
      <Flex mt="100px">
        <ArtworksFilterHeader
          selectedFiltersCount={selectedFiltersCount}
          onFilterPress={() => {}}
        />
      </Flex>
    )
  })
