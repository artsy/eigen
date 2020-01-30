import { Button } from "@artsy/palette"
import { RequestConditionReport_artwork } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me } from "__generated__/RequestConditionReport_me.graphql"
import { RequestConditionReportMutation } from "__generated__/RequestConditionReportMutation.graphql"
import { RequestConditionReportQuery } from "__generated__/RequestConditionReportQuery.graphql"
import { Modal } from "lib/Components/Modal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { PayloadError } from "relay-runtime"

interface RequestConditionReportProps {
  relay?: RelayProp
  artwork: RequestConditionReport_artwork
  me: RequestConditionReport_me
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
export class RequestConditionReport extends React.Component<RequestConditionReportProps, State> {
  state = {
    requestingConditionReport: false,
    showConditionReportRequestedModal: false,
    showErrorModal: false,
    errorModalText: "",
  }

  requestConditionReport = () => {
    const { artwork, relay } = this.props
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
          input: { saleArtworkID: artwork.saleArtwork.internalID },
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
    const { me } = this.props
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
          detailText={`We have received your request.\nThe condition report will be sent to ${me &&
            me.email}.\nFor questions contact specialist@artsy.net.`}
          closeModal={this.closeModals.bind(this)}
        />
      </View>
    )
  }
}

export const RequestConditionReportQueryRenderer: React.FC<{
  artworkID: string
}> = ({ artworkID }) => {
  return (
    <QueryRenderer<RequestConditionReportQuery>
      environment={defaultEnvironment}
      variables={{ artworkID }}
      query={graphql`
        query RequestConditionReportQuery($artworkID: String!) {
          me {
            ...RequestConditionReport_me
          }

          artwork(id: $artworkID) {
            ...RequestConditionReport_artwork
          }
        }
      `}
      render={({ props }) => {
        if (props) {
          return <RequestConditionReportFragmentContainer artwork={props.artwork} me={props.me} />
        } else {
          return null
        }
      }}
    />
  )
}

export const RequestConditionReportFragmentContainer = createFragmentContainer(RequestConditionReport, {
  me: graphql`
    fragment RequestConditionReport_me on Me {
      email
      internalID
    }
  `,
  artwork: graphql`
    fragment RequestConditionReport_artwork on Artwork {
      internalID
      slug
      saleArtwork {
        internalID
      }
    }
  `,
})
