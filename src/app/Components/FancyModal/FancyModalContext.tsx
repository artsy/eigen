import { ExecutionQueue } from "app/utils/ExecutionQueue"
import { useScreenDimensions } from "app/utils/hooks"
import { compact, flatten } from "lodash"
import React, { RefObject, useEffect, useRef, useState } from "react"
import { Animated, View } from "react-native"
import {
  AnimationCreator,
  ease,
  FancyModalAnimationPosition,
  FancyModalCard,
  spring,
} from "./FancyModalCard"

/**
 * This is responsible for managing a stack of FancyModalCard instances, and making sure they are positioned correctly.
 */
class FancyModalCardStack {
  constructor(
    public readonly level: number = 0,
    public readonly stack: Array<RefObject<FancyModalCard>> = [{ current: null }],
    public readonly executionQueue: ExecutionQueue = new ExecutionQueue()
  ) {}

  nextLevel() {
    return new FancyModalCardStack(this.level + 1, this.stack, this.executionQueue)
  }

  // this is called after unusal events (e.g. abrupt unmounts, orientation change) to make sure
  // things are shown where they should be
  cleanup() {
    // remove dead stack entries just in case
    // don't touch first stack entry since it's the main view
    for (let i = this.stack.length - 1; i > 0; i--) {
      if (!this.stack[i].current) {
        this.stack.splice(i, 1)
      }
    }
    runAnimations(this.getStackAnimations(ease))
  }

  getStackAnimations(createAnimation: AnimationCreator) {
    return flatten(
      compact(
        this.stack.map((card) => card.current?.getStackAnimations(createAnimation, this.stack))
      )
    )
  }

  getRootCard(height: number, content: React.ReactNode) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <FancyModalCard
          level={0}
          ref={this.stack[0]}
          onBackgroundPressed={() => null}
          height={height}
          backgroundShouldShrink={false}
        >
          {content}
        </FancyModalCard>
      </View>
    )
  }

  useCard(config: {
    content: React.ReactNode
    height: number
    fullScreen?: boolean
    backgroundShouldShrink: boolean
    animationPosition?: FancyModalAnimationPosition
    onBackgroundPressed(): void
  }): {
    jsx: JSX.Element
    show(): Promise<void>
    hide(): Promise<void>
  } {
    const ref = useRef<FancyModalCard>(null)
    const { content, ...other } = config
    const jsx = (
      <FancyModalCard level={this.level} ref={ref} {...other}>
        {content}
      </FancyModalCard>
    )

    // clean up after unmount
    useEffect(() => {
      return () => {
        if (this.stack.includes(ref)) {
          // this should only happen if a react tree with a visible fancy modal unmounts
          // before the modal is gracefully hidden
          this.stack.splice(this.stack.indexOf(ref), 1)
          this.cleanup()
        }
      }
    }, [])

    return {
      jsx,
      show: async () => {
        await this.executionQueue.executeInQueue(async () => {
          this.stack.push(ref)
          await runAnimations(this.getStackAnimations(spring))
        })
      },
      hide: async () => {
        await this.executionQueue.executeInQueue(async () => {
          if (this.stack.includes(ref)) {
            this.stack.splice(this.stack.indexOf(ref), 1)
            await runAnimations([
              ...this.getStackAnimations(ease),
              ...(ref.current ? ref.current.getPopAnimations(ease) : []),
            ])
          }
        })
      },
    }
  }
}

// this should not be consumed directly
export const FancyModalContext = React.createContext<FancyModalCardStack>(new FancyModalCardStack())

export const _FancyModalPageWrapper: React.FC = ({ children }) => {
  const screen = useScreenDimensions()
  const stack = useRef(new FancyModalCardStack()).current

  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    stack.cleanup()
  }, [screen.orientation])

  return (
    <FancyModalContext.Provider value={stack.nextLevel()}>
      <View style={{ flex: 1 }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
        {!!height && stack.getRootCard(height, children)}
      </View>
    </FancyModalContext.Provider>
  )
}

async function runAnimations(animations: Animated.CompositeAnimation[]) {
  await new Promise((resolve) => Animated.parallel(animations).start(resolve))
}
