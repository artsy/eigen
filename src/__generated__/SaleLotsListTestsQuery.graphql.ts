/* tslint:disable */
/* eslint-disable */
/* @relayHash 81cd056c52848c611ea6fd27290e2b68 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsListTestsQueryVariables = {};
export type SaleLotsListTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_me">;
    } | null;
};
export type SaleLotsListTestsQuery = {
    readonly response: SaleLotsListTestsQueryResponse;
    readonly variables: SaleLotsListTestsQueryVariables;
};



/*
query SaleLotsListTestsQuery {
  me {
    ...LotsByFollowedArtists_me
    id
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
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
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      id
    }
  }
}

fragment LotsByFollowedArtists_me on Me {
  lotsByFollowedArtistsConnection(first: 10, liveSale: true, isAuction: true) {
    edges {
      cursor
      node {
        __typename
        id
      }
      id
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "isAuction",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "liveSale",
    "value": true
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
  "type": "String",
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
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleLotsListTestsQuery",
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
            "name": "LotsByFollowedArtists_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleLotsListTestsQuery",
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
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "storageKey": "lotsByFollowedArtistsConnection(first:10,isAuction:true,liveSale:true)",
            "args": (v0/*: any*/),
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
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
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      },
                      (v1/*: any*/),
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
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          },
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
                        "name": "date",
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
                        "name": "internalID",
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
                        "name": "href",
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
                          (v1/*: any*/)
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "lotLabel",
                            "args": null,
                            "storageKey": null
                          },
                          (v1/*: any*/)
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
                          (v1/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "args": (v0/*: any*/),
            "handle": "connection",
            "key": "LotsByFollowedArtists_lotsByFollowedArtistsConnection",
            "filters": [
              "liveSale",
              "isAuction"
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleLotsListTestsQuery",
    "id": "6f9082b8588d5cf5c1004fa5b9135fd6",
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
        "me.lotsByFollowedArtistsConnection": {
          "type": "SaleArtworksConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges": {
          "type": "ArtworkEdgeInterface",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.pageInfo": {
          "type": "PageInfo",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.cursor": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.id": (v2/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.startCursor": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo.endCursor": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.__typename": {
          "type": "String",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.slug": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.image.aspectRatio": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.node.title": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.date": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleMessage": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.internalID": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.artistNames": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isAuction": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isClosed": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.displayTimelyAt": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.endAt": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.id": (v2/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v2/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.name": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.id": (v2/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.url": (v3/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v3/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '7c2a621764b228a1f417e43b26f0a465';
export default node;
