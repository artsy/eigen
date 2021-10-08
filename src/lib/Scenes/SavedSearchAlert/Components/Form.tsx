import { useFormikContext } from "formik"
import { navigate } from "lib/navigation/navigate"
import { Box, Button, Flex, Input, InputTitle, Pill, Spacer, Text, Touchable } from "palette"
import React from "react"
import { getNamePlaceholder } from "../helpers"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"
import { Toggle } from "./Toggle"

interface FormProps {
  pills: string[]
  savedSearchAlertId?: string
  artistId: string
  artistName: string
  onDeletePress?: () => void
  onSubmitPress?: () => void
  onTogglePushNotification: (enabled: boolean) => void
  onToggleEmailNotification: (enabled: boolean) => void
}

export const Form: React.FC<FormProps> = (props) => {
  const {
    pills,
    artistId,
    artistName,
    savedSearchAlertId,
    onDeletePress,
    onSubmitPress,
    onTogglePushNotification,
    onToggleEmailNotification,
  } = props
  const {
    isSubmitting,
    values,
    errors,
    dirty,
    handleBlur,
    handleChange,
  } = useFormikContext<SavedSearchAlertFormValues>()
  const namePlaceholder = getNamePlaceholder(artistName, pills)

  return (
    <Box>
      <Box mb={2}>
        <Input
          title="Name"
          placeholder={namePlaceholder}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          testID="alert-input-name"
          maxLength={75}
        />
      </Box>
      {!!savedSearchAlertId && (
        <Box mb={2} height={40} justifyContent="center" alignItems="center">
          <Touchable
            haptic
            testID="view-artworks-button"
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            onPress={() =>
              navigate(`artist/${artistId}`, {
                passProps: {
                  searchCriteriaID: savedSearchAlertId,
                },
              })
            }
          >
            <Text variant="xs" color="blue100" style={{ textDecorationLine: "underline" }}>
              View Artworks
            </Text>
          </Touchable>
        </Box>
      )}
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {pills.map((pill, index) => (
            <Pill testID="alert-pill" m={0.5} key={`filter-label-${index}`}>
              {pill}
            </Pill>
          ))}
        </Flex>
      </Box>
      <Spacer mt={1} />
      <Toggle label="Email Alerts" onChange={onToggleEmailNotification} active={values.enableEmailNotifications} />
      <Spacer mt={2} />
      <Toggle label="Mobile Alerts" onChange={onTogglePushNotification} active={values.enablePushNotifications} />
      <Spacer mt={6} />
      <Button
        testID="save-alert-button"
        disabled={!!savedSearchAlertId && !(dirty || values.name.length === 0)}
        loading={isSubmitting}
        size="large"
        block
        onPress={onSubmitPress}
      >
        Save Alert
      </Button>
      {!!savedSearchAlertId && (
        <>
          <Spacer mt={2} />
          <Button testID="delete-alert-button" variant="outline" size="large" block onPress={onDeletePress}>
            Delete Alert
          </Button>
        </>
      )}
    </Box>
  )
}
