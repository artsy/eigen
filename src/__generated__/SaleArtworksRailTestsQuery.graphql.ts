/* tslint:disable */
/* eslint-disable */
/* @relayHash 1197000f64781a2545d0c1654e868ea8 */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "type": "Sale",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v4 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v5 = {
  "type": "SaleArtwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v6 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v7 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v8 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleArtworksRailTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "saleArtworksConnection",
            "storageKey": "saleArtworksConnection(first:10)",
            "args": (v1/*: any*/),
            "concreteType": "SaleArtworkConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "FragmentSpread",
                        "name": "SaleArtworksRail_saleArtworks",
                        "args": null
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
  "operation": {
    "kind": "Operation",
    "name": "SaleArtworksRailTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "saleArtworksConnection",
            "storageKey": "saleArtworksConnection(first:10)",
            "args": (v1/*: any*/),
            "concreteType": "SaleArtworkConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artwork",
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
                                    "value": "small"
                                  }
                                ],
                                "storageKey": "url(version:\"small\")"
                              }
                            ]
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
                            "name": "saleMessage",
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
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "isAuction",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "isClosed",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "displayTimelyAt",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "endAt",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "saleArtwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "counts",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "SaleArtworkCounts",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "bidderPositions",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "currentBid",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "SaleArtworkCurrentBid",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "display",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              },
                              (v2/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "name",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ]
                          },
                          (v2/*: any*/)
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lotLabel",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleArtworksRailTestsQuery",
    "id": "b2abe9af25f788283ba19da356d0671e",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": (v3/*: any*/),
        "sale.saleArtworksConnection": {
          "type": "SaleArtworkConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges": {
          "type": "SaleArtworkEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node": (v5/*: any*/),
        "sale.saleArtworksConnection.edges.node.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.lotLabel": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.artwork.href": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleMessage": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.artistNames": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.slug": (v7/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.internalID": (v7/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale": (v3/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork": (v5/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.artwork.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.image.url": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isAuction": (v8/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isClosed": (v8/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.displayTimelyAt": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.endAt": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner.name": (v6/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner.id": (v4/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid.display": (v6/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '69716b1067e845be427c4faaff21d7c2';
export default node;
