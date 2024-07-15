import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { COUNTRY_SELECT_OPTIONS, CountrySelect } from "app/Components/CountrySelect"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkShippingLocation = () => {
  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()

  const { show: showToast } = useToast()

  const [country, setCountry] = useState<String | null>(null)

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "ShippingLocation">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        await createOrUpdateSubmission(
          {
            location: {
              city: values.location?.city,
              state: values.location?.state,
              country: values.location?.country,
              zipCode: values.location?.zipCode,
              // TODO: Implement this
              // addressLine1: values.location?.addressLine1,
              // TODO: Implement this
              // addressLine2: values.location?.addressLine2,
            },
          },
          values.submissionId
        )

        navigation.navigate("FrameInformation")
        setCurrentStep("FrameInformation")
      } catch (error) {
        console.error("Error setting title", error)
        showToast("Could not save your submission, please try again.", "bottom", {
          backgroundColor: "red100",
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepShippingLocation,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <Flex px={2} flex={1}>
          <Join separator={<Spacer y={2} />}>
            <Text variant="lg-display">Shipping Location</Text>

            <Text color="black60" variant="xs">
              Location is where the artwork ships from. It’s required so we can estimate shipping
              costs and tax.
            </Text>

            <CountrySelect
              onSelectValue={(countryCode) => {
                const newCountry = COUNTRY_SELECT_OPTIONS.find(({ value }) => value === countryCode)
                  ?.label

                if (newCountry) {
                  setCountry(newCountry as string)
                  setFieldValue("location.countryCode", countryCode)
                }
              }}
              value={country}
              required
            />

            <Input
              title="Address Line 1"
              // defaultValue={values.location.addressLine1}
              onChangeText={(text) => setFieldValue("location.addressLine1", text)}
              required
            />

            <Input
              title="Address Line 2"
              // defaultValue={values.location.addressLine2}
              onChangeText={(text) => setFieldValue("location.addressLine2", text)}
            />

            <Input
              title="City"
              defaultValue={values.location?.city ?? ""}
              onChangeText={(text) => setFieldValue("location.city", text)}
              required
            />

            <Input
              title="Postal Code"
              defaultValue={values.location?.zipCode ?? ""}
              onChangeText={(text) => setFieldValue("location.zipCode", text)}
              required
            />

            <Input
              title="State, Province, or Region"
              defaultValue={values.location?.state ?? ""}
              onChangeText={(text) => setFieldValue("location.state", text)}
              required
            />
          </Join>
        </Flex>
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
