export interface Branch {
  [key: string]: Workflow
}
export type Workflow = Array<string | { [event: string]: Branch }>
export type Conditions = Record<string, () => boolean | string>

export class WorkflowEngine {
  __workflow__: Workflow
  workflow: Workflow
  conditions: Conditions
  moves = 0
  index = 0

  constructor({ workflow, conditions = {} }: { workflow: Workflow; conditions?: Conditions }) {
    this.__workflow__ = workflow
    this.workflow = workflow
    this.conditions = conditions
  }

  current(): string {
    const current = this.workflow[this.index]

    if (typeof current === "string") {
      return current
    }

    const [key, outcomes] = this.split(current)
    const rest = this.workflow.slice(this.index + 1)
    const decision = this.decide(key)
    const workflow = [...(outcomes[String(decision)] ?? []), ...(rest ?? [])]

    this.workflow = workflow
    this.index = 0

    return this.current()
  }

  split(leaf: Workflow[number]) {
    console.log(leaf)
    return [Object.keys(leaf)[0], Object.values(leaf)[0]]
  }

  decide(key: string) {
    return this.conditions[key]()
  }

  next() {
    this.moves = this.moves + 1

    if (!this.isEnd()) {
      this.index = this.index + 1
    }

    const current = this.current()

    return current
  }

  isStart() {
    return this.index === 0
  }

  // TODO: implement case for 0 index && current === "object" (Branch)
  back(): string {
    let current: string

    if (this.index === 0) {
      current = this.workflow[0] as string
    }

    this.index = this.index - 1
    this.moves = this.moves - 1

    current = this.current()

    return current
  }

  total() {
    const offset = this.moves - this.index
    return this.workflow.length + offset
  }

  position() {
    return this.moves + 1
  }

  isEnd() {
    return this.index === this.end()
  }

  end() {
    return this.workflow.length - 1
  }

  reset() {
    this.moves = 0
    this.index = 0
    this.workflow = this.__workflow__

    return this.current()
  }
}
