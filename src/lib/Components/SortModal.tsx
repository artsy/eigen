import { Box, Button, CloseIcon, color, Flex, Sans, Serif } from "@artsy/palette"
import React from "react"
import { FlatList, Modal as RNModal, TouchableWithoutFeedback, ViewProperties } from "react-native"
import styled from "styled-components/native"

interface SortModalProps extends ViewProperties {
  visible: boolean
  closeModal?: () => void
}

interface SortModalState {
  isSortModalVisible: boolean
  isComponentMounted: boolean
}

export class SortModal extends React.Component<SortModalProps, SortModalState> {
  state = {
    isSortModalVisible: false,
    isComponentMounted: false,
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
  }

  render() {
    const { visible } = this.props

    return (
      <Box>
        <Sans size="16">THIS IS THE NEXT SCREEN</Sans>
      </Box>
    )
  }
}

// <RNModal animationType="slide" transparent={true} visible={visible}>
//         <TouchableWithoutFeedback>
//           <ModalBackgroundView>
//             <TouchableWithoutFeedback onPress={null}>
//               <>
//                 <Flex onTouchStart={() => this.closeModal()} style={{ flexGrow: 1 }} />
//                 <ModalInnerView visible={this.state.isComponentMounted}>
//                   <Flex flexDirection="row" justifyContent="space-between">
//                     <Sans size="16">Sort Modal </Sans>
//                   </Flex>
//                   {this.props.children}
//                 </ModalInnerView>
//               </>
//             </TouchableWithoutFeedback>
//           </ModalBackgroundView>
//         </TouchableWithoutFeedback>
//       </RNModal>

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
`

const ModalInnerView = styled.View<{ visible: boolean }>`
  flex-direction: column;
  background-color: white;
  height: ${({ visible }) => (visible ? "auto" : "0")};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`
