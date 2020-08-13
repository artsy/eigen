import React, { Ref } from "react"
import styled, { css } from "styled-components"
import { JustifyContentProps, WidthProps } from "styled-system"
import { Box } from "../Box"
import { Flex, FlexProps } from "../Flex"
import { Join } from "../Join"
import { Sans } from "../Typography"

import { color, media, space } from "../../helpers"

export interface TabLike extends JSX.Element {
  props: TabProps
}

type TabNameType = string | JSX.Element
export interface TabInfo {
  /** Display name of the newly selected Tab */
  name: TabNameType

  /** Index of the newly selected Tab */
  tabIndex: number

  /** Data associated with the newly selected Tab */
  data: any
}

// tslint:disable-next-line:ban-types
type InnerRef<T> = Extract<Ref<T>, Function>

export interface TabsProps extends WidthProps, JustifyContentProps {
  /** Function that will be called when a new Tab is selected */
  onChange?: (tabInfo?: TabInfo) => void

  /** Index of the Tab that should be pre-selected */
  initialTabIndex?: number

  /** To be able to extend or modify the way tab buttons are getting rendered
   * default value is an identity function
   */
  transformTabBtn?: (
    Button: JSX.Element,
    tabIndex?: number,
    props?: any
  ) => JSX.Element

  separator?: JSX.Element

  // If the tabs do not fit on screen, should the list automatically scroll
  // to keep the active tab in view
  autoScroll?: boolean

  children: TabLike[]
}

export interface TabsState {
  activeTabIndex: number
}

/** A tabbar navigation component */
export class Tabs extends React.Component<TabsProps, TabsState> {
  public static defaultProps: Partial<TabsProps> = {
    justifyContent: "left",
    transformTabBtn: Button => Button,
    separator: <Box ml={2} />,
  }

  constructor(props) {
    super(props)

    const activeTabIndex =
      props.initialTabIndex || this.props.children.findIndex(tab => !!tab)
    this.state = {
      activeTabIndex,
    }
  }

  setActiveTab = activeTabIndex => {
    this.setState({
      activeTabIndex,
    })
    if (this.props.onChange) {
      this.props.onChange({
        tabIndex: activeTabIndex,
        name: this.props.children[activeTabIndex].props.name,
        data: this.props.children[activeTabIndex].props.data,
      })
    }
  }

  containerRef: HTMLDivElement | null = null
  activeTabRef: HTMLDivElement | null = null

  handleScroll = () => {
    if (!this.props.autoScroll || !this.containerRef || !this.activeTabRef) {
      return
    }

    const contentWidth = this.containerRef.scrollWidth
    const boxWidth = this.containerRef.offsetWidth

    if (boxWidth >= contentWidth) {
      return
    }

    const containerRect = this.containerRef.getBoundingClientRect()
    const activeTabRect = this.activeTabRef.getBoundingClientRect()
    const activeTabOffset = activeTabRect.left - containerRect.left
    const desiredActiveTabOffset =
      containerRect.width / 2 - activeTabRect.width / 2
    const offsetDiff = activeTabOffset - desiredActiveTabOffset
    const currentScroll = this.containerRef.scrollLeft
    const desiredScroll = currentScroll + offsetDiff
    this.containerRef.scrollTo({ left: desiredScroll })
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleScroll)
    this.handleScroll()
  }

  componentDidUpdate() {
    this.handleScroll()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleScroll)
  }

  renderTab = (tab, index) => {
    if (!tab) {
      return false
    }
    const { name } = tab.props
    return this.state.activeTabIndex === index
      ? this.props.transformTabBtn(
          <ActiveTabButton key={index}>{name}</ActiveTabButton>,
          index,
          this.props
        )
      : this.props.transformTabBtn(
          <TabButton key={index} onClick={() => this.setActiveTab(index)}>
            {name}
          </TabButton>,
          index,
          this.props
        )
  }

  render() {
    const { children = [], separator } = this.props
    return (
      <>
        <TabsContainer
          scrollRef={ref => (this.containerRef = ref)}
          justifyContent={this.props.justifyContent}
        >
          <Join separator={separator}>{children.map(this.renderTab)}</Join>
        </TabsContainer>
        <Box pt={3}>{children[this.state.activeTabIndex]}</Box>
      </>
    )
  }
}

/** A container for the tab bar */
export const TabsContainer: React.SFC<
  FlexProps & { scrollRef?: InnerRef<HTMLDivElement> }
> = ({ scrollRef, ...props }) => {
  return (
    <TabsOuterContainer>
      <TabsScrollContainer
        mb={0.5}
        width="100%"
        {...props}
        ref={scrollRef as any}
      >
        <TabsPaddingContainer justifyContent={props.justifyContent}>
          {props.children}
        </TabsPaddingContainer>
      </TabsScrollContainer>
    </TabsOuterContainer>
  )
}

interface TabProps {
  /** Display name of the Tab */
  name: TabNameType
  /**
   * Arbitrary data that can be associated with a Tab.
   *
   * Will be passed to the parent <Tabs>'s onChange handler.
   */
  data?: any
}

/** An individual tab */
export class Tab extends React.Component<TabProps> {
  render() {
    return this.props.children || null
  }
}

const TabButton = ({ children, ...props }) => {
  return (
    <TabContainer {...props}>
      <Sans size="3t" weight="medium" color="black30">
        {children}
      </Sans>
    </TabContainer>
  )
}

const ActiveTabButton: React.SFC = ({ children }) => {
  return (
    <ActiveTabContainer>
      <Sans size="3t" weight="medium">
        {children}
      </Sans>
    </ActiveTabContainer>
  )
}

/** Sharable tab styles  */
export const sharedTabsStyles = {
  tabContainer: css`
    cursor: pointer;
    padding-bottom: 13px;
    white-space: nowrap;
  `,
  activeTabContainer: css`
    pointer-events: none;
    padding-bottom: 13px;
    white-space: nowrap;
    border-bottom: 1px solid ${color("black60")};
  `,
}

const TabsOuterContainer = styled(Flex)`
  width: 100%;
  border-bottom: 1px solid ${color("black10")};
  position: relative;
  top: -1px;

  > div {
    position: relative;
    top: 1px;
  }
`
// TODO: This justifyContent ternary should be removed after we move TabCarousel to Palette
const TabsPaddingContainer = styled(Flex)<JustifyContentProps>`
  width: ${props => (props.justifyContent ? "auto" : "100%")};

  ${media.xs`
    padding: 0 ${space(2)}px;
  `};
`

const TabsScrollContainer = styled(Flex)`
  ${media.xs`
    overflow-y: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  `};
  margin-bottom: 0;
`

const TabContainer = styled.div`
  ${sharedTabsStyles.tabContainer};
`

/** The active container */
export const ActiveTabContainer = styled.div`
  ${sharedTabsStyles.activeTabContainer};
`

const SupWrapper = styled.sup`
  margin-left: 2px;
`

/** Embeddable sup container */
export const Sup: React.SFC<{}> = ({ children }) => (
  <SupWrapper>
    <Sans size="1" weight="medium" display="inline">
      {children}
    </Sans>
  </SupWrapper>
)
