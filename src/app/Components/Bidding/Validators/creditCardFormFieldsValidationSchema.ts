import * as Yup from "yup"

export const creditCardFormValidationSchema = Yup.object().shape({
  creditCard: Yup.object().shape({
    valid: Yup.boolean().required("Credit card is required"),
  }),
  fullName: Yup.string().required("Name is required"),
  addressLine1: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  state: Yup.string().required("State is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.object().shape({
    shortName: Yup.string().required("Country is required"),
  }),
})
