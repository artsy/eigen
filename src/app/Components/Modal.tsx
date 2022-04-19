import { defaultRules, MarkdownRules } from "app/utils/renderMarkdown"
import { Button, Sans, SansProps } from "palette"
import React from "react"
import { Modal as RNModal, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import styled from "styled-components/native"
import { Markdown } from "./Markdown"

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

const DEFAULT_MARKDOWN_RULES = defaultRules({})

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
    const markdownRules = {
      ...DEFAULT_MARKDOWN_RULES,
      paragraph: {
        ...DEFAULT_MARKDOWN_RULES.paragraph,
        react: (node, output, state) => {
          return (
            <Sans size="3" color="black60" key={state.key} textAlign={this.props.textAlign}>
              {output(node.content, state)}
            </Sans>
          )
        },
      },
    } as MarkdownRules

    return (
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
                  <Markdown rules={markdownRules} pb={15}>
                    {detailText}
                  </Markdown>
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
    )
  }
}
