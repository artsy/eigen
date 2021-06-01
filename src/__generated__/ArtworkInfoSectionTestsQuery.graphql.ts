/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f9d791b0cf5a271c14bd41ef6c571e88 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkInfoSectionTestsQueryVariables = {};
export type ArtworkInfoSectionTestsQueryResponse = {
    readonly commerceOrder: {
        readonly internalID: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkInfoSection_artwork">;
    } | null;
};
export type ArtworkInfoSectionTestsQuery = {
    readonly response: ArtworkInfoSectionTestsQueryResponse;
    readonly variables: ArtworkInfoSectionTestsQueryVariables;
};



/*
query ArtworkInfoSectionTestsQuery {
  commerceOrder(id: "some-id") {
    __typename
    internalID
    ...ArtworkInfoSection_artwork
    id
  }
}

fragment ArtworkInfoSection_artwork on CommerceOrder {
  __isCommerceOrder: __typename
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          medium
          editionOf
          dimensions {
            in
            cm
          }
          date
          image {
            url(version: "square60")
          }
          title
          artistNames
          id
        }
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkInfoSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtworkInfoSection_artwork"
          }
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtworkInfoSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "CommerceLineItemConnection",
            "kind": "LinkedField",
            "name": "lineItems",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommerceLineItemEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceLineItem",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "artwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "medium",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "editionOf",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "dimensions",
                            "kind": "LinkedField",
                            "name": "dimensions",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "in",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cm",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "square60"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"square60\")"
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lineItems(first:1)"
          },
          (v2/*: any*/)
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ]
  },
  "params": {
    "id": "f9d791b0cf5a271c14bd41ef6c571e88",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "commerceOrder": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "commerceOrder.__isCommerceOrder": (v3/*: any*/),
        "commerceOrder.__typename": (v3/*: any*/),
        "commerceOrder.id": (v4/*: any*/),
        "commerceOrder.internalID": (v4/*: any*/),
        "commerceOrder.lineItems": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItemConnection"
        },
        "commerceOrder.lineItems.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceLineItemEdge"
        },
        "commerceOrder.lineItems.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItem"
        },
        "commerceOrder.lineItems.edges.node.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "commerceOrder.lineItems.edges.node.artwork.artistNames": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.date": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.dimensions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "dimensions"
        },
        "commerceOrder.lineItems.edges.node.artwork.dimensions.cm": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.dimensions.in": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.editionOf": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.id": (v4/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "commerceOrder.lineItems.edges.node.artwork.image.url": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.medium": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.title": (v5/*: any*/),
        "commerceOrder.lineItems.edges.node.id": (v4/*: any*/)
      }
    },
    "name": "ArtworkInfoSectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5d2179e9e1db79f20da2095123598bf9';
export default node;
