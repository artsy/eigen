import { Button, Sans } from "@artsy/palette"
import { theme } from "lib/Components/Bidding/Elements/Theme"
import React from "react"
import { Modal as RNModal, TouchableWithoutFeedback, View, ViewProperties } from "react-native"
import styled from "styled-components/native"

interface ModalProps extends ViewProperties {
  headerText: string
  detailText: string
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
  width: 300;
  background-color: white;
  padding: 20px;
  opacity: 1;
  border-radius: 2px;
`

export class Modal extends React.Component<ModalProps, any> {
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
    const { headerText, detailText } = this.props

    return (
      <View style={{ marginTop: this.state.modalVisible ? 22 : 0 }}>
        <RNModal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <TouchableWithoutFeedback onPress={() => this.closeModal()}>
            <ModalBackgroundView>
              <TouchableWithoutFeedback onPress={null}>
                <ModalInnerView>
                  <View style={{ paddingBottom: 10 }}>
                    <Sans size="3" weight="medium">
                      {headerText}
                    </Sans>
                  </View>
                  <View style={{ paddingBottom: 30 }}>
                    <Sans size="3" color={theme.colors.black60}>
                      {detailText}
                    </Sans>
                  </View>
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
              </TouchableWithoutFeedback>
            </ModalBackgroundView>
          </TouchableWithoutFeedback>
        </RNModal>
      </View>
    )
  }
}
