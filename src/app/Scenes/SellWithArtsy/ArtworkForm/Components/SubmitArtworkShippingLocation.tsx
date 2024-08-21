import { Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { COUNTRY_SELECT_OPTIONS, CountrySelect } from "app/Components/CountrySelect"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"
import { useRef } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkShippingLocation = () => {
  const { values, setFieldValue } = useFormikContext<SubmissionModel>()

  const addressRef = useRef<Input>(null)
  const address2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)

  const { show: showToast } = useToast()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "ShippingLocation">>()

  const { useSubmitArtworkScreenTracking } = useSubmissionContext()

  useSubmitArtworkScreenTracking("ShippingLocation")

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
              countryCode: values.location?.countryCode,
              zipCode: values.location?.zipCode,
              address: values.location?.address,
              address2: values.location?.address2,
            },
          },
          values.externalId
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
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <Flex px={2} flex={1}>
        <Join separator={<Spacer y={2} />} flatten>
          <Text variant="lg-display">Shipping Location</Text>

          <Text color="black60" variant="xs">
            Location is where the artwork ships from. It’s required so we can estimate shipping
            costs and tax.
          </Text>

          <CountrySelect
            onSelectValue={(countryCode) => {
              const newCountry = COUNTRY_SELECT_OPTIONS.find(({ value }) => value === countryCode)

              if (newCountry) {
                setFieldValue("location.country", newCountry.label)
                setFieldValue("location.countryCode", newCountry.value)
              }
            }}
            value={
              values.location?.countryCode ||
              COUNTRY_SELECT_OPTIONS.find(({ label }) => label === values.location?.country)?.value
            }
            required
            testID="country-select"
          />

          {!!values.location?.country && (
            <Join separator={<Spacer y={2} />}>
              <Input
                title="Address Line 1"
                value={values.location?.address}
                onChangeText={(text) => setFieldValue("location.address", text)}
                required
                ref={addressRef}
                onSubmitEditing={() => {
                  address2Ref.current?.focus()
                }}
              />

              <Input
                title="Address Line 2"
                defaultValue={values.location?.address2}
                onChangeText={(text) => setFieldValue("location.address2", text)}
                ref={address2Ref}
                onSubmitEditing={() => {
                  cityRef.current?.focus()
                }}
              />

              <Input
                title="City"
                defaultValue={values.location?.city ?? ""}
                onChangeText={(text) => setFieldValue("location.city", text)}
                required
                ref={cityRef}
                onSubmitEditing={() => {
                  postalCodeRef.current?.focus()
                }}
              />

              <Input
                title="Postal Code"
                defaultValue={values.location?.zipCode ?? ""}
                onChangeText={(text) => setFieldValue("location.zipCode", text)}
                required
                ref={postalCodeRef}
                onSubmitEditing={() => {
                  stateRef.current?.focus()
                }}
              />

              <Input
                title="State, Province, or Region"
                defaultValue={values.location?.state ?? ""}
                onChangeText={(text) => setFieldValue("location.state", text)}
                required
                ref={stateRef}
              />
            </Join>
          )}
        </Join>
      </Flex>
    </ScrollView>
  )
}
