import React from "react"
import { ScrollView } from "react-native"

import { Sans12, Serif16 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"

import { Formik, FormikProps } from "formik"
import * as Yup from "yup"
import { Flex } from "../Elements/Flex"
import { Address } from "./ConfirmFirstTimeBid"

interface BillingAddressProps {
  onSubmit?: (values: Address) => null
  billingAddress?: Address
}

export class BillingAddress extends React.Component<BillingAddressProps> {
  static defaultProps = {
    billingAddress: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    },
  }

  validationSchema = Yup.object().shape({
    fullName: Yup.string().required("This field is required"),
    addressLine1: Yup.string().required("This field is required"),
    addressLine2: Yup.string(),
    city: Yup.string().required("This field is required"),
    state: Yup.string().required("This field is required"),
    postalCode: Yup.string().required("This field is required"),
  })

  render() {
    return (
      <BiddingThemeProvider>
        <ScrollView>
          <Formik
            validationSchema={this.validationSchema}
            initialValues={this.props.billingAddress}
            onSubmit={(values: Address) => this.props.onSubmit(values)}
          >
            {({ values, errors, touched, setFieldValue, handleSubmit }: FormikProps<Address>) => (
              <Container>
                <Title mt={0} mb={6}>
                  Your billing address
                </Title>

                <StyledInput
                  error={touched.fullName && errors.fullName}
                  label="Full name"
                  onChangeText={text => setFieldValue("fullName", text)}
                  placeholder="Enter your full name"
                  value={values.fullName}
                />

                <StyledInput
                  error={touched.addressLine1 && errors.addressLine1}
                  label="Address line 1"
                  onChangeText={text => setFieldValue("addressLine1", text)}
                  placeholder="Enter your street address"
                  value={values.addressLine1}
                />

                <StyledInput
                  error={touched.addressLine2 && errors.addressLine2}
                  label="Address line 2 (optional)P"
                  onChangeText={text => setFieldValue("addressLine2", text)}
                  placeholder="Enter your apt, floor, suite, etc."
                  value={values.addressLine2}
                />

                <StyledInput
                  error={touched.city && errors.city}
                  label="City"
                  onChangeText={text => setFieldValue("city", text)}
                  placeholder="Enter city"
                  value={values.city}
                />

                <StyledInput
                  error={touched.state && errors.state}
                  label="State, Province, or Region"
                  onChangeText={text => setFieldValue("state", text)}
                  placeholder="Enter state, province, or region"
                  value={values.state}
                />

                <StyledInput
                  error={touched.postalCode && errors.postalCode}
                  label="Postal code"
                  onChangeText={text => setFieldValue("postalCode", text)}
                  placeholder="Enter your postal code"
                  value={values.postalCode}
                />

                <Button text="Add billing address" onPress={handleSubmit} />
              </Container>
            )}
          </Formik>
        </ScrollView>
      </BiddingThemeProvider>
    )
  }
}

const StyledInput = ({ label, error, ...props }) => (
  <Flex mb={4}>
    <Serif16 mb={2}>{label}</Serif16>
    <Input mb={3} error={Boolean(error)} {...props} />
    {error && <Sans12 color="red100">{error}</Sans12>}
  </Flex>
)
