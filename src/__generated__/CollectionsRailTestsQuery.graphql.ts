/* tslint:disable */
/* eslint-disable */
/* @relayHash ae9ab6e70efb5024dbba1bb67c715ab2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionsRailTestsQueryVariables = {};
export type CollectionsRailTestsQueryResponse = {
    readonly homePage: {
        readonly marketingCollectionsModule: {
            readonly " $fragmentRefs": FragmentRefs<"CollectionsRail_collectionsModule">;
        } | null;
    } | null;
};
export type CollectionsRailTestsQueryRawResponse = {
    readonly homePage: ({
        readonly marketingCollectionsModule: ({
            readonly results: ReadonlyArray<({
                readonly title: string;
                readonly slug: string;
                readonly artworksConnection: ({
                    readonly counts: ({
                        readonly total: number | null;
                    }) | null;
                    readonly edges: ReadonlyArray<({
                        readonly node: ({
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string | null;
                        }) | null;
                    }) | null> | null;
                    readonly id: string | null;
                }) | null;
                readonly id: string | null;
            }) | null>;
        }) | null;
    }) | null;
};
export type CollectionsRailTestsQuery = {
    readonly response: CollectionsRailTestsQueryResponse;
    readonly variables: CollectionsRailTestsQueryVariables;
    readonly rawResponse: CollectionsRailTestsQueryRawResponse;
};



/*
query CollectionsRailTestsQuery {
  homePage {
    marketingCollectionsModule {
      ...CollectionsRail_collectionsModule
    }
  }
}

fragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {
  results {
    title
    slug
    artworksConnection(first: 3) {
      counts {
        total
      }
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CollectionsRailTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "marketingCollectionsModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageMarketingCollectionsModule",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "CollectionsRail_collectionsModule",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionsRailTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "marketingCollectionsModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageMarketingCollectionsModule",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "title",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slug",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:3)",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksCounts",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "total",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "node",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "image",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Image",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "large"
                                      }
                                    ],
                                    "storageKey": "url(version:\"large\")"
                                  }
                                ]
                              },
                              (v0/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v0/*: any*/)
                    ]
                  },
                  (v0/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionsRailTestsQuery",
    "id": "300622f2a252bf1da69a417c6e705635",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '1515b35dee6e677382437e445a880a03';
export default node;
