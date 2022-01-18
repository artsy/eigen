import { Button, ClassTheme, Sans, SansProps } from "palette"
import React from "react"
import { Modal as RNModal, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import styled from "styled-components/native"

interface ModalProps extends ViewProps {
  headerText: string
  detailText: string
  visible?: boolean
  textAlign?: SansProps["textAlign"]
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
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)

    this.state = { modalVisible: props.visible || false }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      <ClassTheme>
        {({ color }) => (
          <View style={{ marginTop: 22 }}>
            <RNModal animationType="fade" transparent visible={this.state.modalVisible}>
              <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                <ModalBackgroundView>
                  <TouchableWithoutFeedback>
                    <ModalInnerView>
                      <View style={{ paddingBottom: 10 }}>
                        <Sans size="3" weight="medium" textAlign={this.props.textAlign}>
                          {headerText}
                        </Sans>
                      </View>
                      <View style={{ paddingBottom: 30 }}>
                        <Sans size="3" color={color("black60")} textAlign={this.props.textAlign}>
                          {detailText}
                        </Sans>
                      </View>
                      <Button
                        onPress={() => {
                          this.closeModal()
                        }}
                        block
                        width={100}
                        variant="outline"
                      >
                        Ok
                      </Button>
                    </ModalInnerView>
                  </TouchableWithoutFeedback>
                </ModalBackgroundView>
              </TouchableWithoutFeedback>
            </RNModal>
          </View>
        )}
      </ClassTheme>
    )
  }
}
