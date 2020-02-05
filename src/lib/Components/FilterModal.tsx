import { Box, Button, CloseIcon, Flex, Sans } from "@artsy/palette"
import React from "react"
import { LayoutAnimation, Modal as RNModal, TouchableWithoutFeedback, ViewProperties } from "react-native"
import styled from "styled-components/native"

interface ModalProps extends ViewProperties {
  visible?: boolean
  closeModal?: () => void
}

interface State {
  isComponentMounted: boolean
}

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
`

const ModalInnerView = styled.View<{ visible: boolean }>`
  flex-direction: column;
  width: 100%;
  background-color: white;
  height: ${({ visible }) => (visible ? "auto" : "0")};
  padding: ${({ visible }) => (visible ? "20px" : "0")};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

export class FilterModal extends React.Component<ModalProps, State> {
  constructor(props) {
    super(props)

    this.state = { isComponentMounted: false }
  }

  componentDidMount() {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({ isComponentMounted: true })
    }, 100)
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
  }

  render() {
    /*
    https://app.zeplin.io/project/5aabc5e0786bbb29b6e3dc7f/screen/5dba03df09bf3f5547162ac9

    Next steps:

    - Add a Navigator
      - Configure left button to be x close
      - Configure right button for "clear all"
    - Define a TypeScript interface to represent possible filter states (take a look at the Pick TypeScript generic)
    - Implement the rest of the UI
    - Add callbacks for when filter has been cleared / reset / applied

    Let's start with a single filter (sort, or medium maybe) and get it working end-to-end in Collections
    Look at Reactions' ArtworkFilter implementation, which does something similar ^
    */
    return (
      <RNModal animationType="fade" transparent={true} visible={this.props.visible}>
        <TouchableWithoutFeedback>
          <ModalBackgroundView>
            <TouchableWithoutFeedback onPress={null}>
              <>
                <Flex onTouchStart={() => this.closeModal()} style={{ flexGrow: 1 }} />
                <ModalInnerView visible={this.state.isComponentMounted}>
                  <Flex flexDirection="row" justifyContent="space-between">
                    <Flex alignItems="flex-end" mt={0.5} mb={2}>
                      <Box onTouchEnd={() => this.closeModal()}>
                        <CloseIcon fill="black100" />
                      </Box>
                    </Flex>
                    <Sans weight="medium" size="4">
                      Filter
                    </Sans>
                    <Sans size="4">Clear all</Sans>
                  </Flex>
                  {this.props.children}
                  <Button
                    onPress={() => {
                      this.closeModal()
                    }}
                    block
                    width={100}
                    variant="secondaryOutline"
                  >
                    Ok
                  </Button>
                </ModalInnerView>
              </>
            </TouchableWithoutFeedback>
          </ModalBackgroundView>
        </TouchableWithoutFeedback>
      </RNModal>
    )
  }
}
