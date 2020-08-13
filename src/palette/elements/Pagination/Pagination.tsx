import React from "react"
import styled, { css } from "styled-components"

import { Box, Flex, Sans } from "../"
import { color, space } from "../../helpers"
import { ChevronIcon } from "../../svgs"

interface Props {
  onClick?: (cursor: string, page: number) => void
  onNext?: () => void
  pageCursors: any
  hasNextPage: boolean
  scrollTo?: string
}

/** LargePagination */
export const LargePagination = (props: Props) => {
  const {
    pageCursors: { around, first, last, previous },
    onClick,
    onNext,
    hasNextPage,
  } = props

  return (
    <Flex
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="baseline"
      mr={-1}
    >
      {first && (
        <div>
          {renderPage(first, onClick)}
          <PageSpan mx={0.5} />
        </div>
      )}

      {around.map(pageInfo => renderPage(pageInfo, onClick))}

      {last && (
        <div>
          <PageSpan mx={0.5} />
          {renderPage(last, onClick)}
        </div>
      )}

      <Box ml={4}>
        <PrevButton
          disabled={!previous}
          onClick={() => {
            if (previous) {
              props.onClick(previous.cursor, previous.page)
            }
          }}
        />
        <NextButton disabled={!hasNextPage} onClick={() => onNext()} />
      </Box>
    </Flex>
  )
}

/** SmallPagination */
export const SmallPagination = (props: Props) => {
  const {
    pageCursors: { previous },
    onClick,
    onNext,
    hasNextPage,
  } = props

  return (
    <Flex flexDirection="row" width="100%">
      <PrevNextFlex
        className={!previous ? "disabled" : null}
        width="50%"
        pr={0.5}
      >
        <ButtonWithBorder
          alignItems="center"
          justifyContent="flex-start"
          pl={1}
          onClick={() => {
            if (previous) {
              onClick(previous.cursor, previous.page)
            }
          }}
        >
          <ChevronIcon direction="left" />
        </ButtonWithBorder>
      </PrevNextFlex>
      <PrevNextFlex
        className={!hasNextPage ? "disabled" : null}
        width="50%"
        pl={0.5}
      >
        <ButtonWithBorder
          onClick={() => onNext()}
          alignItems="center"
          justifyContent="flex-end"
          pr={1}
        >
          <ChevronIcon direction="right" />
        </ButtonWithBorder>
      </PrevNextFlex>
    </Flex>
  )
}

const ButtonWithBorder = styled(Flex)`
  border: ${props => props.theme.borders[1]};
  border-color: ${color("black10")};
  border-radius: 3px;
  width: 100%;
  height: ${space(4)}px;
  cursor: pointer;
`
const PageSpan = ({ mx }) => {
  return (
    <Sans size="3" display="inline" mx={mx} color="black30">
      ...
    </Sans>
  )
}

const renderPage = (
  pageCursor,
  onClick: (cursor: string, page: number) => void
) => {
  const { cursor, isCurrent, page } = pageCursor
  return (
    <Page
      onClick={() => onClick(cursor, page)}
      num={page}
      active={isCurrent}
      key={cursor + page}
    />
  )
}

const Page = ({ num, onClick, ...props }) => {
  return (
    <Button {...props} onClick={() => onClick()}>
      <Sans size="3" weight="medium" display="inline">
        {num}
      </Sans>
    </Button>
  )
}

const activeButton = css`
  background: ${color("black5")};
  border-radius: 2px;
  border: 0;
`

const Button = styled.button<{ active?: boolean }>`
  cursor: pointer;
  width: min-content;
  height: 25px;
  background: transparent;
  border: 0;

  outline: 0;

  ${p => p.active && activeButton};

  &:hover {
    ${activeButton};
  }
`
const PrevButton = ({ onClick, disabled }) => {
  return (
    <PrevNextContainer className={disabled ? "disabled" : null}>
      <Sans size="3" weight="medium" display="inline" mx={0.5}>
        <a onClick={() => onClick()} className="noUnderline">
          <ChevronIcon direction="left" top={space(0.5)} /> Prev
        </a>
      </Sans>
    </PrevNextContainer>
  )
}

const NextButton = ({ onClick, disabled }) => {
  return (
    <PrevNextContainer className={disabled ? "disabled" : null}>
      <Sans size="3" weight="medium" display="inline" mx={0.5}>
        <a onClick={() => onClick()} className="noUnderline">
          Next <ChevronIcon direction="right" top={space(0.5)} />
        </a>
      </Sans>
    </PrevNextContainer>
  )
}

const PrevNextContainer = styled.span`
  &.disabled {
    opacity: 0.1;
  }
`

const PrevNextFlex = styled(Flex)`
  &.disabled {
    opacity: 0.1;
  }
`

// Tests
ButtonWithBorder.displayName = "ButtonWithBorder"
PrevButton.displayName = "PrevButton"
NextButton.displayName = "NextButton"
