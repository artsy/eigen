import { Button, Sans } from "@artsy/palette"
import { theme } from "lib/Components/Bidding/Elements/Theme"
import React from "react"
import { Modal as RNModal, TouchableWithoutFeedback, View, ViewProperties } from "react-native"
import styled from "styled-components/native"

interface ModalProps extends ViewProperties {
  visible?: boolean
  closeModal?: () => void
}

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ModalInnerView = styled.View`
  flex-direction: column;
  width: 100%;
  background-color: white;
  padding: 20px;
  opacity: 1;
`

export class FilterModal extends React.Component<ModalProps, any> {
  constructor(props) {
    super(props)

    this.state = { modalVisible: props.visible || false }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ modalVisible: this.props.visible })
    }
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
    this.setState({ modalVisible: false })
  }

  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <RNModal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <TouchableWithoutFeedback onPress={() => this.closeModal()}>
            <ModalBackgroundView>
              <TouchableWithoutFeedback onPress={null}>
                <>
                  <View style={{ flexGrow: 1 }} />
                  <ModalInnerView>
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
      </View>
    )
  }
}
