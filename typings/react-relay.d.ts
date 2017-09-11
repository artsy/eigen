// Type definitions for react-relay 1.0.0
// Project: https://github.com/facebook/relay
// Definitions by: Johannes Schickling <https://github.com/graphcool>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

declare module "react-relay" {
  import * as modern from "react-relay/modern"
  export = modern
}

declare module "react-relay/compat" {
  import * as modern from "react-relay/modern"
  export = modern
}

declare module "react-relay/modern" {
  import * as React from "react"

  interface QueryRendererProps {
    cacheConfig?: any
    environment: Environment | ClassicEnvironment
    query: GraphQLTaggedNode
    render: (readyState: ReadyState) => (React.ReactElement<any>) | null
    variables: Variables
  }

  interface ReadyState {
    error: Error | null
    props: object | null
    retry: () => void | null
  }

  class QueryRenderer extends React.Component<QueryRendererProps, ReadyState> {}

  export type GraphQLTaggedNode = (() => ConcreteFragment | ConcreteBatch)
  export interface GeneratedNodeMap {
    [key: string]: GraphQLTaggedNode
  }

  function graphql(strings: TemplateStringsArray): GraphQLTaggedNode

  namespace graphql {
    var experimental: typeof graphql
  }

  function createFragmentContainer<T>(
    Component: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap
  ): React.ComponentClass<T>

  function createRefetchContainer<T>(
    Component: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap,
    taggedNode: GraphQLTaggedNode
  ): React.ComponentClass<T>

  function createPaginationContainer<T>(
    ComponentClass: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap,
    connectionConfig: ConnectionConfig
  ): React.ComponentClass<T>

  function commitMutation<T>(environment: CompatEnvironment, config: MutationConfig<T>): Disposable

  // RelayNetworkTypes.js

  export namespace RelayNetworkTypes {
    export interface PayloadError {
      message: string
      locations?: Array<{
        line: number
        column: number
      }>
    }
  }

  // TODO: put these in sections of the files they come from too

  export type DataID = string
  export type RelayConcreteNode = Object

  export type RangeBehaviors = any // TODO: add proper typing

  export type RelayMutationConfig =
    | {
        type: "FIELDS_CHANGE"
        fieldIDs: { [fieldName: string]: DataID | DataID[] }
      }
    | {
        type: "RANGE_ADD"
        parentName?: string
        parentID?: string
        connectionInfo?: Array<{
          key: string
          filters?: Variables
          rangeBehavior: "append" | "prepend" | "ignore"
        }>
        connectionName?: string
        edgeName: string
        rangeBehaviors?: RangeBehaviors
      }
    | {
        type: "NODE_DELETE"
        parentName?: string
        parentID?: string
        connectionName?: string
        deletedIDFieldName: string
      }
    | {
        type: "RANGE_DELETE"
        parentName?: string
        parentID?: string
        connectionKeys?: Array<{
          key: string
          filters?: Variables
        }>
        connectionName?: string
        deletedIDFieldName: string | string[]
        pathToConnection: string[]
      }
    | {
        type: "REQUIRED_CHILDREN"
        children: RelayConcreteNode[]
      }

  export type CompatEnvironment = Environment | RelayClassicEnvironment
  export type Environment = any // Todo: add proper types
  export type RelayClassicEnvironment = any // Todo: add proper types
  export type ClassicEnvironment = any // Todo: add proper types

  export interface MutationConfig<T = Object> {
    mutation: GraphQLTaggedNode
    variables: Variables
    onCompleted?: ((response: T, errors: RelayNetworkTypes.PayloadError[] | null) => void) | null
    onError?: ((error: Error) => void) | null
    // FIXME This appears to be incorrect, because Relay complains about it being a function.
    // optimisticResponse?: (() => Object) | null
    optimisticResponse?: Object | null
    optimisticUpdater?: ((store: RecordSourceSelectorProxy) => void) | null
    updater?: ((store: RecordSourceSelectorProxy, data: T) => void) | null
    configs?: RelayMutationConfig[]
  }
  export type RecordSourceSelectorProxy = any // Todo: add proper types

  export interface ConnectionConfig {
    direction?: "backward" | "forward"
    getConnectionFromProps?: (props: any) => ConnectionData | null
    getFragmentVariables?: FragmentVariablesGetter
    getVariables: (
      props: any,
      paginationInfo: { count: number; cursor: string | null },
      fragmentVariables: Variables
    ) => Variables
    query: GraphQLTaggedNode
  }

  type PageInfo = string

  export interface ConnectionData {
    edges?: any[] | null
    pageInfo?: PageInfo | null
  }

  type FragmentVariablesGetter = (prevVars: Variables, totalCount: number) => Variables

  export interface ConcreteFragment {
    argumentDefinitions: ConcreteArgumentDefinition[]
    kind: "Fragment"
    metadata: { [key: string]: any }
    name: string
    selections: ConcreteSelection[]
    type: string
  }

  export interface ConcreteCondition {
    kind: "Condition"
    passingValue: boolean
    condition: string
    selections: ConcreteSelection[]
  }

  export type ConcreteArgument = ConcreteLiteral | ConcreteVariable

  export interface ConcreteLiteral {
    kind: "Literal"
    name: string
    type: string | null
    value: any
  }

  export interface ConcreteVariable {
    kind: "Variable"
    name: string
    type: string | null
    variableName: string
  }

  export type ConcreteArgumentDefinition = ConcreteLocalArgument | ConcreteRootArgument

  export interface ConcreteRootArgument {
    kind: "RootArgument"
    name: string
    type: string | null
  }

  export interface ConcreteFragmentSpread {
    args: ConcreteArgument[]
    kind: "FragmentSpread"
    name: string
  }

  export type ConcreteField = ConcreteScalarField | ConcreteLinkedField

  export interface ConcreteScalarField {
    alias: string | null
    args: ConcreteArgument[] | null
    kind: "ScalarField"
    name: string
    storageKey: string | null
  }

  export interface ConcreteLinkedField {
    alias: string | null
    args: ConcreteArgument[] | null
    concreteType: string | null
    kind: "LinkedField"
    name: string
    plural: boolean
    selections: ConcreteSelection[]
    storageKey: string | null
  }

  export type ConcreteHandle = ConcreteScalarHandle | ConcreteLinkedHandle

  export interface ConcreteScalarHandle {
    alias: string
    args: ConcreteArgument[]
    kind: "ScalarHandle"
    name: string
    handle: string
    key: string
    filters: string[]
  }

  export interface ConcreteLinkedHandle {
    alias: string
    args: ConcreteArgument[]
    kind: "LinkedHandle"
    name: string
    handle: string
    key: string
    filters: string[]
  }

  export interface ConcreteInlineFragment {
    kind: "InlineFragment"
    selections: ConcreteSelection[]
    type: string
  }

  export type ConcreteSelection =
    | ConcreteCondition
    | ConcreteField
    | ConcreteFragmentSpread
    | ConcreteHandle
    | ConcreteInlineFragment

  export interface ConcreteLocalArgument {
    defaultValue: any
    kind: "LocalArgument"
    name: string
    type: string
  }

  export interface ConcreteRoot {
    argumentDefinitions: ConcreteLocalArgument[]
    kind: "Root"
    name: string
    operation: "mutation" | "query" | "subscription"
    selections: ConcreteSelection[]
  }

  export interface ConcreteBatch {
    kind: "Batch"
    fragment: ConcreteFragment
    id: string
    metadata: { [key: string]: any }
    name: string
    query: ConcreteRoot
    text: string
  }

  export interface RefetchOptions {
    force?: boolean
  }

  export type Variables = any
  export interface Disposable {
    dispose: () => void
  }

  interface RelayProp {
    environment: Environment
  }

  interface RelayRefetchProp extends RelayProp {
    refetch: (
      refetchVariables: Variables | ((fragmentVariables: Variables) => Variables),
      renderVariables: Variables | null,
      // The example code has this optional but in the flow type it's not
      callback?: ((error: Error | null) => void) | null,
      options?: RefetchOptions
    ) => Disposable
  }

  interface RelayPaginationProp extends RelayProp {
    hasMore: () => boolean
    isLoading: () => boolean
    loadMore: (pageSize: number, callback: (error: Error | null) => void, options?: RefetchOptions) => Disposable | null
    refetchConnection: (totalCount: number, callback: (error: Error | null) => void) => Disposable | null
  }
}

declare module "react-relay/classic" {
  import * as React from "react"

  type ClientMutationID = string

  /** Fragments are a hash of functions */
  interface Fragments {
    [query: string]: ((variables?: RelayVariables) => string)
  }

  interface CreateContainerOpts {
    initialVariables?: any
    fragments: Fragments
    prepareVariables?(prevVariables: RelayVariables): RelayVariables
  }

  interface RelayVariables {
    [name: string]: any
  }

  /** add static getFragment method to the component constructor */
  interface RelayContainerClass<T> extends React.ComponentClass<T> {
    getFragment: ((q: string, v?: RelayVariables) => string)
  }

  interface RelayQueryRequestResolve {
    response: any
  }

  type RelayMutationStatus =
    | "UNCOMMITTED" // Transaction hasn't yet been sent to the server. Transaction can be committed or rolled back.
    | "COMMIT_QUEUED" // Transaction was committed but another transaction with the same collision key is pending, so the transaction has been queued to send to the server.
    | "COLLISION_COMMIT_FAILED" //Transaction was queued for commit but another transaction with the same collision key failed. All transactions in the collision queue, including this one, have been failed. Transaction can be recommitted or rolled back.
    | "COMMITTING" // Transaction is waiting for the server to respond.
    | "COMMIT_FAILED"

  class RelayMutationTransaction {
    applyOptimistic(): RelayMutationTransaction
    commit(): RelayMutationTransaction | null
    recommit(): void
    rollback(): void
    getError(): Error
    getStatus(): RelayMutationStatus
    getHash(): string
    getID(): ClientMutationID
  }

  interface RelayMutationRequest {
    getQueryString(): string
    getVariables(): RelayVariables
    resolve(result: RelayQueryRequestResolve): any
    reject(errors: any): any
  }

  interface RelayQueryRequest {
    resolve(result: RelayQueryRequestResolve): any
    reject(errors: any): any

    getQueryString(): string
    getVariables(): RelayVariables
    getID(): string
    getDebugName(): string
  }

  interface RelayNetworkLayer {
    supports(...options: string[]): boolean
  }

  class DefaultNetworkLayer implements RelayNetworkLayer {
    constructor(host: string, options?: any)
    supports(...options: string[]): boolean
  }

  function createContainer<T>(
    component: React.ComponentClass<T> | React.StatelessComponent<T>,
    params?: CreateContainerOpts
  ): RelayContainerClass<T>
  function injectNetworkLayer(networkLayer: RelayNetworkLayer): any
  function isContainer(component: React.ComponentClass<any>): boolean
  function QL(...args: any[]): string

  class Route {
    constructor(params?: RelayVariables)
  }

  /**
     * Relay Mutation class, where T are the props it takes and S is the returned payload from Relay.Store.update.
     * S is typically dynamic as it depends on the data the app is currently using, but it's possible to always
     * return some data in the payload using REQUIRED_CHILDREN which is where specifying S is the most useful.
     */
  class Mutation<T, S> {
    props: T

    constructor(props: T)
    static getFragment(q: string): string
  }

  interface Transaction {
    getError(): Error
    Status(): number
  }

  interface StoreUpdateCallbacks<T> {
    onFailure?(transaction: Transaction): any
    onSuccess?(response: T): any
  }

  interface Store {
    commitUpdate(mutation: Mutation<any, any>, callbacks?: StoreUpdateCallbacks<any>): any
  }

  var Store: Store

  class RootContainer extends React.Component<RootContainerProps, any> {}

  interface RootContainerProps extends React.Props<RootContainer> {
    Component: RelayContainerClass<any>
    route: Route
    renderLoading?(): JSX.Element
    renderFetched?(data: any): JSX.Element
    renderFailure?(error: Error, retry: Function): JSX.Element
  }

  type ReadyStateEvent =
    | "ABORT"
    | "CACHE_RESTORED_REQUIRED"
    | "CACHE_RESTORE_FAILED"
    | "CACHE_RESTORE_START"
    | "NETWORK_QUERY_ERROR"
    | "NETWORK_QUERY_RECEIVED_ALL"
    | "NETWORK_QUERY_RECEIVED_REQUIRED"
    | "NETWORK_QUERY_START"
    | "STORE_FOUND_ALL"
    | "STORE_FOUND_REQUIRED"

  type OnReadyStateChange = (
    readyState: {
      ready: boolean
      done: boolean
      stale: boolean
      error?: Error
      events: ReadyStateEvent[]
      aborted: boolean
    }
  ) => void

  export interface RelayProp {
    readonly route: { name: string } // incomplete, also has params and queries
    readonly variables: any
    readonly pendingVariables?: any | null
    setVariables(variables: any, onReadyStateChange?: OnReadyStateChange): void
    forceFetch(variables: any, onReadyStateChange?: OnReadyStateChange): void
    hasOptimisticUpdate(record: any): boolean
    getPendingTransactions(record: any): RelayMutationTransaction[]
    commitUpdate: (mutation: Mutation<any, any>, callbacks?: StoreUpdateCallbacks<any>) => any
  }
}
