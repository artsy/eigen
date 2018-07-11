import { theme } from "lib/Components/Bidding/Elements/Theme"
import React from "react"
import { Modal, TouchableWithoutFeedback, View, ViewProperties } from "react-native"
import { Sans14, SansMedium14 } from "./Bidding/Elements/Typography"
import { SecondaryOutlineButton } from "./Buttons"

interface CustomModalProps extends ViewProperties {
  headerText: string
  detailText: string
  visible?: boolean
  closeModal?: () => void
}

export class CustomModal extends React.Component<CustomModalProps, any> {
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
      <View style={{ marginTop: 22 }}>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
          <TouchableWithoutFeedback onPress={() => this.closeModal()}>
            <View
              style={{
                backgroundColor: "#00000099",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback onPress={null}>
                <View style={{ width: 300, backgroundColor: "white", padding: 20, opacity: 1, borderRadius: 2 }}>
                  <View style={{ paddingBottom: 20 }}>
                    <SansMedium14>{headerText}</SansMedium14>
                  </View>
                  <View style={{ paddingBottom: 30 }}>
                    <Sans14 color={theme.colors.black60}>{detailText}</Sans14>
                  </View>
                  <SecondaryOutlineButton
                    text="Ok"
                    style={{ height: 40, borderRadius: 2, borderWidth: 2 }}
                    onPress={() => {
                      this.closeModal()
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    )
  }
}
