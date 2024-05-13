import { validateArtworkSchema } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/artworkSchema"
import { SubmitArtworkFormStoreProvider } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import {
  ArtworkDetailsFormModel,
  artworkDetailsEmptyInitialValues,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FormikProvider, useFormik } from "formik"

const FormikWrapper: React.FC<{}> = ({ children }) => {
  const initialValues = artworkDetailsEmptyInitialValues as any

  const handleSubmit = () => {
    // Implement when needed
  }

  const formik = useFormik<ArtworkDetailsFormModel>({
    enableReinitialize: true,
    initialValues: initialValues,
    initialErrors: validateArtworkSchema(initialValues),
    onSubmit: handleSubmit,
    validationSchema: getCurrentValidationSchema,
  })

  return <FormikProvider value={formik}>{children}</FormikProvider>
}

export const renderWithSubmitArtworkWrapper = ({
  component,
}: {
  component: React.ReactElement
}) => {
  return renderWithWrappers(
    <SubmitArtworkFormStoreProvider>
      <FormikWrapper>{component}</FormikWrapper>
    </SubmitArtworkFormStoreProvider>
  )
}

export const setupWithSubmitArtworkTestWrappers = ({
  Component,
}: {
  Component: React.ReactElement
}) => {
  return setupTestWrapper({
    Component: () => (
      <SubmitArtworkFormStoreProvider>
        <FormikWrapper>{Component}</FormikWrapper>
      </SubmitArtworkFormStoreProvider>
    ),
  })
}
