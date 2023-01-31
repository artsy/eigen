import { noop } from "lodash"
import { useTheme } from "palette/Theme"
import { ToolTipFlyout, ToolTipTextContainer } from "palette/elements/ToolTip/ToolTipFlyout"
import { TriangleDown } from "palette/svgs"
import { createContext, useContext, useRef, useState } from "react"
import { View } from "react-native"
import { useScreenDimensions } from "shared/hooks"

interface ToolTipContextValues {
  dismissToolTip: () => void
  setToolTip: (toolTip: string) => void
}

interface ToolTipProps {
  enabled?: Boolean
  initialToolTipText?: string
  maxWidth?: number
  position?: "TOP" | "BOTTOM"
  tapToDismiss?: boolean
  testID?: string
  /** vertical margin of tooltip */
  yOffset?: number
}

export const ToolTipContext = createContext<ToolTipContextValues>({
  dismissToolTip: () => noop,
  setToolTip: () => noop,
})

/**
 * A ToolTip Component
 * @example
 * <ToolTip initialToolTipText="A tool tip text">
 *   <View />
 * </ToolTip>
 *
 * @example
 * <ToolTip initialToolTipText="A tool tip text">
 *   <ToolTipContext.Consumer>
 *     {({ setToolTip, dismissToolTip }) => (
 *       <Component
 *         changeToolTipText={setToolTip}
 *         hideToolTip={dismissToolTip}
 *       />
 *     )}
 *   </ToolTipContext.Consumer>
 * </ToolTip>
 *
 */
export const ToolTip: React.FC<ToolTipProps> = ({
  children,
  enabled = true,
  initialToolTipText,
  maxWidth,
  position = "TOP",
  tapToDismiss = false,
  testID,
  yOffset = 5,
}) => {
  const { space } = useTheme()
  const mWidth = useScreenDimensions().width - space(2) * 2 // 40 accounting for padding 20 on each side of the screen
  const MAX_TOOLTIP_WIDTH = maxWidth ?? mWidth

  const [toolTipText, setToolTip] = useState(initialToolTipText)
  const [childrenDimensions, setChildrenDimensions] = useState({ height: 0, width: 0, x: 0 })
  const [singleTextDimension, setSingleTextDimension] = useState({ height: 0, width: 0 })
  const dismissToolTip = () => setToolTip(undefined)

  const [pageX, setPageX] = useState(0)
  const childrenRef = useRef<View>(null)

  const totalTextWidth = singleTextDimension.width * (toolTipText?.length ?? 0)

  const finalToolTipWidth = Math.min(totalTextWidth, MAX_TOOLTIP_WIDTH)

  const numOfLines = getNumberOfLines(finalToolTipWidth, totalTextWidth)

  const finalToolTipHeight = numOfLines * singleTextDimension.height

  const triangleXDisplacement = childrenDimensions.x + childrenDimensions.width / 2

  // Calculate the direction of flow of the tooltip. So a tooltip near the right edge of the screen
  // should flow to the left so it remains in the viewport, and vice-versa. Without this, tooltip
  // around the edges can flow off screen
  const nearLeftEdge = pageX < mWidth / 4
  const nearRightEdge = pageX > mWidth - mWidth / 4
  const extraStyle = nearLeftEdge ? { left: 0 } : nearRightEdge ? { right: 0 } : undefined

  return (
    <ToolTipContext.Provider
      value={{
        dismissToolTip,
        setToolTip,
      }}
    >
      {enabled && position === "TOP" && (
        <>
          <ToolTipFlyout
            containerStyle={{
              bottom: childrenDimensions.height + yOffset,
              ...extraStyle,
            }}
            tapToDismiss={tapToDismiss}
            height={finalToolTipHeight}
            width={finalToolTipWidth}
            onClose={dismissToolTip}
            position={position}
            testID={testID}
            text={toolTipText}
          />
          {enabled && position === "TOP" && toolTipText && (
            <TriangleDown
              style={{
                left: triangleXDisplacement,
                position: "absolute",
                bottom: childrenDimensions.height + yOffset - 5, // where 5 is the triangle icon size
              }}
            />
          )}
        </>
      )}
      <View
        ref={childrenRef}
        onLayout={(event) => {
          setChildrenDimensions({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width,
            x: event.nativeEvent.layout.x,
          })
          childrenRef.current?.measure(
            (
              _fx: number,
              _fy: number,
              _width: number,
              _height: number,
              px: number,
              _py: number
            ) => {
              setPageX(px)
            }
          )
        }}
      >
        {children}
      </View>
      {enabled && position === "BOTTOM" && (
        <>
          <ToolTipFlyout
            containerStyle={{
              top: childrenDimensions.height + yOffset,
              ...extraStyle,
            }}
            tapToDismiss={tapToDismiss}
            height={finalToolTipHeight}
            width={finalToolTipWidth}
            onClose={dismissToolTip}
            position={position}
            testID={testID}
            text={toolTipText}
          />
          {enabled && position === "BOTTOM" && toolTipText && (
            <TriangleDown
              style={{
                transform: [{ rotate: "180deg" }],
                left: triangleXDisplacement,
                position: "absolute",
                top: childrenDimensions.height + yOffset - 5, // where 5 is the triangle icon size,
              }}
            />
          )}
        </>
      )}

      {/** We use the singleText here as a sample to precalculate the height and width each
       * letter of the text will need. With this info we can correctly estimate the required total width.
       * Also this helps us to know beforehand the size (width and height) to animate/inflate the container to
       */}
      {enabled && toolTipText && (
        <View
          style={{ position: "absolute", opacity: 0 }}
          onLayout={({ nativeEvent }) => {
            setSingleTextDimension({
              height: nativeEvent.layout.height,
              width: nativeEvent.layout.width,
            })
          }}
        >
          {/** "x" is the perfect sample that fits all letters' width and height */}
          <ToolTipTextContainer text="x" />
        </View>
      )}
    </ToolTipContext.Provider>
  )
}

export const useToolTipContext = () => {
  const context = useContext(ToolTipContext)
  if (!context) {
    throw new Error(
      "Attempted to use useToolTipContext outside of ToolTip Provider. Please wrap your component with <ToolTip>"
    )
  }
  return context
}

/** Given a maximum width and a total width, how many of the maximum widths can we get from the total width?
 * The answer gotten will let us know how many lines of text the tool tip text will need.
 *  Note: We add one for whatever spill over remains i.e text that does not fill an entire line.
 */
const getNumberOfLines = (maxWidth: number, totalWidth: number, numLines = 0): number => {
  if (maxWidth >= totalWidth) {
    return numLines + 1
  }
  const remainder = totalWidth - maxWidth
  if (remainder > -1) {
    numLines = numLines += 1
  }
  return getNumberOfLines(maxWidth, remainder, numLines)
}
