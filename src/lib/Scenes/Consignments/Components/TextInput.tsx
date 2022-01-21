import { themeGet } from "@styled-system/theme-get"
import { Box, ClassTheme, useColor, useTheme } from "palette"
import React, { FunctionComponent } from "react"
import {
  ActivityIndicator,
  Image,
  ImageURISource,
  Text,
  TextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewProps,
} from "react-native"
import styled from "styled-components/native"

interface ReffableTextInputProps extends RNTextInputProps {
  ref?: (component: any) => any
}

export interface TextInputProps extends ViewProps {
  searching?: boolean
  readonly?: boolean
  text?: ReffableTextInputProps
  preImage?: ImageURISource | ImageURISource[]
  LocationIcon?: FunctionComponent
}

interface State {
  focused: boolean
}

const Input = styled.TextInput`
  height: 40;
  color: ${themeGet("colors.black100")};
  font-family: "Unica77LL-Regular";
  font-size: 16;
  flex: 1;
`

const Separator = (focused: boolean) => {
  const color = useColor()
  return (
    <View
      style={{
        height: 1,
        backgroundColor: focused ? color("black100") : color("black60"),
      }}
    />
  )
}

const ReadOnlyInput = (props: TextInputProps) => {
  const { theme, color } = useTheme()
  return (
    <Text
      style={{
        color: color("black100"),
        fontFamily: theme.fonts.sans.regular,
        fontSize: 16,
        paddingTop: 8,
      }}
    >
      {props.text! /* STRICTNESS_MIGRATION */.value ||
        props.text! /* STRICTNESS_MIGRATION */.placeholder}
    </Text>
  )
}

export default class TextInputField extends React.Component<TextInputProps, State> {
  inputRef: TextInput | null = null
  timeout: number | null = null

  constructor(props: TextInputProps) {
    super(props)
    this.state = { focused: false }
  }

  componentDidMount() {
    if (this.props.text?.autoFocus) {
      this.inputRef?.focus()
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  render() {
    const LocationIcon = this.props.LocationIcon
    return (
      <ClassTheme>
        {({ color }) => (
          <View style={[this.props.style, { flex: 1, maxHeight: 40 }]}>
            <View style={{ flexDirection: "row", height: 40 }}>
              {
                // LocationIcon needs offset because the pin icon from pallete
                // is centered on the pin's tip
              }
              {!!LocationIcon && (
                <Box style={{ top: 11 }}>
                  <LocationIcon />
                </Box>
              )}
              {!!this.props.preImage && (
                <Image source={this.props.preImage} style={{ marginRight: 6, marginTop: 12 }} />
              )}
              {this.props.readonly ? (
                ReadOnlyInput(this.props)
              ) : (
                <Input
                  ref={(ref) => (this.inputRef = ref as any) /* STRICTNESS_MIGRATION */}
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardAppearance="dark"
                  placeholderTextColor={color("black60")}
                  selectionColor={color("black60")}
                  {...this.props.text}
                  autoFocus={false}
                  onFocus={(e) =>
                    this.setState(
                      { focused: true },
                      () => this.props.text && this.props.text.onFocus && this.props.text.onFocus(e)
                    )
                  }
                  onBlur={(e) =>
                    this.setState(
                      { focused: false },
                      () => this.props.text && this.props.text.onBlur && this.props.text.onBlur(e)
                    )
                  }
                />
              )}

              {this.props.searching ? <ActivityIndicator animating={this.props.searching} /> : null}
            </View>
            {Separator(this.state.focused)}
          </View>
        )}
      </ClassTheme>
    )
  }
}
