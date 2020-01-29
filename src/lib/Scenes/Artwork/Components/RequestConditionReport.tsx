import { Button } from "@artsy/palette"
import { Modal } from "lib/Components/Modal"
import { Schema, screenTrack, track } from "lib/utils/track"
import React from "react"
import { View } from "react-native"
import { commitMutation, graphql, RelayProp } from "react-relay"
import { PayloadError } from "relay-runtime"

interface Props {
  saleArtworkID: string
  relay?: RelayProp
}

interface State {
  requestingConditionReport: boolean
  showConditionReportRequestedModal: boolean
  showErrorModal: boolean
  errorModalText: string
}

@screenTrack({
  context_screen: Schema.PageNames.RequestConditionReportPage,
  context_screen_owner_type: null,
})
export class RequestConditionReport extends React.Component<Props, State> {
  state = {
    requestingConditionReport: false,
    showConditionReportRequestedModal: false,
    showErrorModal: false,
    errorModalText: "",
  }

  requestConditionReport = () => {
    const { saleArtworkID, relay } = this.props
    return new Promise(async (resolve, reject) => {
      commitMutation<RequestConditionReportMutation>(relay.environment, {
        onCompleted: data => {
          resolve(data)
        },
        onError: error => {
          reject(error)
        },
        mutation: graphql`
          mutation RequestConditionReportMutation($input: RequestConditionReportInput!) {
            requestConditionReport(input: $input) {
              conditionReportRequest {
                internalID
              }
            }
          }
        `,
        variables: {
          input: { saleArtworkID },
        },
      })
    })
  }

  // TODO: add tracking
  presentErrorModal(errors: Error | ReadonlyArray<PayloadError>, mutationMessage: string) {
    console.error("RequestConditionReport.tsx", errors)

    const errorMessage = mutationMessage || "There was a problem processing your request. Please try again."
    this.setState({ showErrorModal: true, errorModalText: errorMessage, requestingConditionReport: false })
  }

  // TODO: add tracking
  requestConditionReportSuccess = () => {
    this.setState({ showConditionReportRequestedModal: true, requestingConditionReport: false })
  }

  handleRequestConditionReportClick = () => {
    this.setState({ requestingConditionReport: true })

    this.requestConditionReport()
      .then(data => {
        const theData = data as any
        if (theData.requestConditionReport) {
          this.requestConditionReportSuccess()
        } else {
          this.presentErrorModal(null, null)
        }
      })
      .catch(error => {
        this.presentErrorModal(error, null)
      })
  }

  closeModals() {
    this.setState({ showConditionReportRequestedModal: false, showErrorModal: false })
  }

  render() {
    const { requestingConditionReport, showErrorModal, errorModalText, showConditionReportRequestedModal } = this.state

    return (
      <View>
        <Button
          mt={1}
          size="small"
          variant="secondaryGray"
          loading={requestingConditionReport}
          onPress={this.handleRequestConditionReportClick}
        >
          Request condition report
        </Button>

        <Modal
          visible={showErrorModal}
          headerText="An error occurred"
          detailText={errorModalText}
          closeModal={this.closeModals.bind(this)}
        />

        <Modal
          visible={showConditionReportRequestedModal}
          headerText="Condition Report Requested"
          detailText="We have received your request. The condition report will be sent to."
          closeModal={this.closeModals.bind(this)}
        />
      </View>
    )
  }
}
