import { AuthenticationFormValues } from "app/Scenes/Onboarding/Components/AuthenticationWizard"
import { useFormikContext } from "formik"

export const useAuthenticationFormContext = () => {
  return useFormikContext<AuthenticationFormValues>()
}
