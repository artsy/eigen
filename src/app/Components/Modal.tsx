import { Text, TextProps, Button } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { MarkdownText, MarkdownTextProps } from "app/Components/MarkdownText/MarkdownText"
import {
  registerPresentedOverlay,
  unregisterPresentedOverlay,
} from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { defaultRules, MarkdownRules } from "app/utils/renderMarkdown"
import React from "react"
import { Modal as RNModal, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import styled from "styled-components/native"
import { Markdown } from "./Markdown"

interface ModalProps extends ViewProps {
  headerText: string
  detailText: string
  visible?: boolean
  textAlign?: TextProps["textAlign"]
  closeModal?: () => void
  accessibilityLabel?: string
}

interface ModalState {
  modalVisible: boolean
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
  background-color: ${themeGet("colors.mono0")};
  padding: 20px;
  opacity: 1;
  border-radius: 2px;
`

const DEFAULT_MARKDOWN_RULES = defaultRules({})

const ModalDetailText: React.FC<{
  detailText: string
  markdownRules: MarkdownRules
  textAlign: ModalProps["textAlign"]
}> = ({ detailText, markdownRules, textAlign }) => {
  const enableEnrichedMarkdown = useFeatureFlag("AREnableEnrichedMarkdown")

  if (enableEnrichedMarkdown) {
    return (
      <View style={{ paddingBottom: 15 }}>
        <MarkdownText
          markdown={detailText}
          color="mono60"
          textAlign={textAlign as MarkdownTextProps["textAlign"]}
        />
      </View>
    )
  }

  return (
    <Markdown rules={markdownRules} pb="15px">
      {detailText}
    </Markdown>
  )
}

export class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props)

    this.state = { modalVisible: props.visible || false }
  }

  // Onboarding popovers are themselves full-screen native Modals; registering here stops
  // one presenting on top of this modal.
  private readonly overlayId = `Modal-${Math.random().toString(36).slice(2)}`

  componentDidMount() {
    if (this.state.modalVisible) {
      registerPresentedOverlay(this.overlayId)
    }
  }

  componentWillUnmount() {
    unregisterPresentedOverlay(this.overlayId)
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ modalVisible: this.props.visible ?? false })

      if (this.props.visible) {
        registerPresentedOverlay(this.overlayId)
      } else {
        unregisterPresentedOverlay(this.overlayId)
      }
    }
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
    this.setState({ modalVisible: false })
  }

  render() {
    const { headerText, detailText, accessibilityLabel } = this.props
    const markdownRules = {
      ...DEFAULT_MARKDOWN_RULES,
      paragraph: {
        ...DEFAULT_MARKDOWN_RULES.paragraph,
        react: (node, output, state) => {
          return (
            <Text variant="sm" color="mono60" key={state.key} textAlign={this.props.textAlign}>
              {output(node.content, state)}
            </Text>
          )
        },
      },
    } as MarkdownRules

    return (
      <View style={{ marginTop: 22 }}>
        <RNModal
          accessibilityLabel={accessibilityLabel}
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
        >
          <TouchableWithoutFeedback accessibilityRole="button" onPress={() => this.closeModal()}>
            <ModalBackgroundView>
              <ModalInnerView>
                <View style={{ paddingBottom: 10 }}>
                  <Text variant="sm" weight="medium" textAlign={this.props.textAlign}>
                    {headerText}
                  </Text>
                </View>
                <ModalDetailText
                  detailText={detailText}
                  markdownRules={markdownRules}
                  textAlign={this.props.textAlign}
                />
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
            </ModalBackgroundView>
          </TouchableWithoutFeedback>
        </RNModal>
      </View>
    )
  }
}
