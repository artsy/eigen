/* tslint:disable */
/* eslint-disable */
/* @relayHash e6ee8170a6966fb88c69de820685c64d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentlySoldTestsQueryVariables = {};
export type RecentlySoldTestsQueryResponse = {
    readonly targetSupply: {
        readonly " $fragmentRefs": FragmentRefs<"RecentlySold_targetSupply">;
    } | null;
};
export type RecentlySoldTestsQuery = {
    readonly response: RecentlySoldTestsQueryResponse;
    readonly variables: RecentlySoldTestsQueryVariables;
};



/*
query RecentlySoldTestsQuery {
  targetSupply {
    ...RecentlySold_targetSupply
  }
}

fragment RecentlySold_targetSupply on TargetSupply {
  microfunnel {
    artworksConnection(first: 1) {
      edges {
        node {
          slug
          internalID
          href
          artistNames
          image {
            imageURL
          }
          realizedPrice
          id
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RecentlySoldTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "targetSupply",
        "storageKey": null,
        "args": null,
        "concreteType": "TargetSupply",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "RecentlySold_targetSupply",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RecentlySoldTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "targetSupply",
        "storageKey": null,
        "args": null,
        "concreteType": "TargetSupply",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "microfunnel",
            "storageKey": null,
            "args": null,
            "concreteType": "TargetSupplyMicrofunnelItem",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:1)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1
                  }
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
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
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "slug",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "internalID",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "href",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "artistNames",
                            "args": null,
                            "storageKey": null
                          },
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
                                "name": "imageURL",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "realizedPrice",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  }
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
    "name": "RecentlySoldTestsQuery",
    "id": "9c872d63af54e43ab3fea379e092e6b4",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '5da441336da68f36aa8849b65827450b';
export default node;
