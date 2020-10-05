/* tslint:disable */
/* eslint-disable */
/* @relayHash 6eed93b8f35c048ddeb0c03e9b7a785a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworksRailTestsQueryVariables = {};
export type SaleArtworksRailTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_me">;
    } | null;
};
export type SaleArtworksRailTestsQuery = {
    readonly response: SaleArtworksRailTestsQueryResponse;
    readonly variables: SaleArtworksRailTestsQueryVariables;
};



/*
query SaleArtworksRailTestsQuery {
  me {
    ...SaleArtworksRail_me
    id
  }
}

fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
  artwork {
    artistNames
    date
    href
    image {
      imageURL: url(version: "small")
      aspectRatio
    }
    internalID
    slug
    saleMessage
    title
    id
  }
  counts {
    bidderPositions
  }
  currentBid {
    display
  }
  lotLabel
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
}

fragment SaleArtworksRail_me on Me {
  saleArtworksRail: lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true) {
    edges {
      node {
        id
        href
        saleArtwork {
          ...SaleArtworkTileRailCard_saleArtwork
          id
        }
      }
      id
    }
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
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v2 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v3 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v4 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v5 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v6 = {
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
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleArtworksRail_me",
            "args": null
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
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "saleArtworksRail",
            "name": "lotsByFollowedArtistsConnection",
            "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10
              },
              {
                "kind": "Literal",
                "name": "includeArtworksByFollowedArtists",
                "value": true
              }
            ],
            "concreteType": "SaleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtwork",
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
                      (v0/*: any*/),
                      (v1/*: any*/),
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
                            "name": "artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
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
                                "name": "date",
                                "args": null,
                                "storageKey": null
                              },
                              (v1/*: any*/),
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
                                    "alias": "imageURL",
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "small"
                                      }
                                    ],
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "aspectRatio",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
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
                                "name": "slug",
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
                                "name": "title",
                                "args": null,
                                "storageKey": null
                              },
                              (v0/*: any*/)
                            ]
                          },
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "lotLabel",
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
                              (v0/*: any*/)
                            ]
                          },
                          (v0/*: any*/)
                        ]
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
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleArtworksRailTestsQuery",
    "id": "f243c0c8e75503e542fc6eca0f998c62",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "type": "Me",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.id": (v2/*: any*/),
        "me.saleArtworksRail": {
          "type": "SaleArtworksConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node": (v3/*: any*/),
        "me.saleArtworksRail.edges.id": (v2/*: any*/),
        "me.saleArtworksRail.edges.node.id": (v4/*: any*/),
        "me.saleArtworksRail.edges.node.href": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.id": (v2/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork": (v3/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.lotLabel": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.artistNames": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.date": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.href": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.internalID": (v4/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.slug": (v4/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.saleMessage": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.title": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.id": (v2/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.saleArtworksRail.edges.node.saleArtwork.currentBid.display": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.sale.isAuction": (v6/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.sale.isClosed": (v6/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.sale.displayTimelyAt": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.sale.id": (v2/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.image.imageURL": (v5/*: any*/),
        "me.saleArtworksRail.edges.node.saleArtwork.artwork.image.aspectRatio": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": false
        }
      }
    }
  }
};
})();
(node as any).hash = '69fd2b75a64fb2957c7369feb2ccacaa';
export default node;
