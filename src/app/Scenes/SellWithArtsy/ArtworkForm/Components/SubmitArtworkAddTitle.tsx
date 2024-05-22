import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"

export const SubmitArtworkAddTitle = () => {
  const { handleChange, values } = useFormikContext<ArtworkDetailsFormModel>()

  return (
    <Flex>
      {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Add artwork title
      </Text>

      <Input
        placeholder="Artwork Title"
        onChangeText={handleChange("title")}
        value={values.title}
        autoFocus
        spellCheck={false}
        autoCorrect={false}
      />

      <Spacer y={2} />

      <Text color="black60" variant="xs">
        Add ‘Unknown’ if unsure
      </Text>
    </Flex>
  )
}
