import { Box } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
// import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { FC } from "react"
import styled, { keyframes } from "styled-components"

export type ProgressiveOnboardingHighlightPosition = "center" | { top: string; left: string }

interface ProgressiveOnboardingHighlightProps {
  name: string
  position: ProgressiveOnboardingHighlightPosition
}

export const ProgressiveOnboardingHighlight: FC<ProgressiveOnboardingHighlightProps> = ({
  children,
  name,
  position,
}) => {
  // useProgressiveOnboardingTracking({ name })

  return (
    <Box position="relative" width="100%">
      <Highlight
        {...(position === "center"
          ? {
              top: "50%",
              left: "50%",
              marginTop: -SIZE / 2,
              marginLeft: -SIZE / 2,
            }
          : {
              top: position.top,
              left: position.left,
            })}
      />

      {children}
    </Box>
  )
}

const pulse = keyframes`
  0% { transform: scale(0.8); }
  50% { transform: scale(1); }
  100% { transform: scale(0.8); }
`

const SIZE = 38

export const Highlight = styled(Box)`
  position: absolute;
  pointer-events: none;
  border: 3px solid ${themeGet("colors.blue10")};
  animation: ${pulse} 2s ease-in-out infinite;
  border-radius: 50%;
  height: ${SIZE}px;
  width: ${SIZE}px;
`
