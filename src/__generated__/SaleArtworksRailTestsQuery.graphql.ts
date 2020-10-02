/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b2abe9af25f788283ba19da356d0671e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworksRailTestsQueryVariables = {};
export type SaleArtworksRailTestsQueryResponse = {
    readonly sale: {
        readonly saleArtworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_saleArtworks">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type SaleArtworksRailTestsQuery = {
    readonly response: SaleArtworksRailTestsQueryResponse;
    readonly variables: SaleArtworksRailTestsQueryVariables;
};



/*
query SaleArtworksRailTestsQuery {
  sale(id: "the-sale") {
    saleArtworksConnection(first: 10) {
      edges {
        node {
          ...SaleArtworksRail_saleArtworks
          id
        }
      }
    }
    id
  }
}

fragment SaleArtworksRail_saleArtworks on SaleArtwork {
  artwork {
    image {
      url(version: "small")
    }
    href
    saleMessage
    artistNames
    slug
    internalID
    sale {
      isAuction
      isClosed
      displayTimelyAt
      endAt
      id
    }
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      id
    }
    partner {
      name
      id
    }
    id
  }
  lotLabel
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
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
  "type": "SaleArtwork"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v7 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleArtworksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "SaleArtworkConnection",
            "kind": "LinkedField",
            "name": "saleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtworkEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "SaleArtworksRail_saleArtworks"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "saleArtworksConnection(first:10)"
          }
        ],
        "storageKey": "sale(id:\"the-sale\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SaleArtworksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "SaleArtworkConnection",
            "kind": "LinkedField",
            "name": "saleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtworkEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
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
                                    "value": "small"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"small\")"
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "href",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "slug",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "internalID",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isAuction",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isClosed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "kind": "LinkedField",
                            "name": "saleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtworkCounts",
                                "kind": "LinkedField",
                                "name": "counts",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "bidderPositions",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtworkCurrentBid",
                                "kind": "LinkedField",
                                "name": "currentBid",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "display",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "name",
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lotLabel",
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
            "storageKey": "saleArtworksConnection(first:10)"
          },
          (v2/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      }
    ]
  },
  "params": {
    "id": "b2abe9af25f788283ba19da356d0671e",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": (v3/*: any*/),
        "sale.id": (v4/*: any*/),
        "sale.saleArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkConnection"
        },
        "sale.saleArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtworkEdge"
        },
        "sale.saleArtworksConnection.edges.node": (v5/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "sale.saleArtworksConnection.edges.node.artwork.artistNames": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.href": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "sale.saleArtworksConnection.edges.node.artwork.image.url": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.internalID": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "sale.saleArtworksConnection.edges.node.artwork.partner.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner.name": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale": (v3/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.displayTimelyAt": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.endAt": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isAuction": (v7/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isClosed": (v7/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork": (v5/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid.display": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleMessage": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.slug": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.lotLabel": (v6/*: any*/)
      }
    },
    "name": "SaleArtworksRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '69716b1067e845be427c4faaff21d7c2';
export default node;
