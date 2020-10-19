/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4021b9a63f518eac23382892f0be61bd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsListTestsQueryVariables = {};
export type SaleLotsListTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_me">;
    } | null;
};
export type SaleLotsListTestsQuery = {
    readonly response: SaleLotsListTestsQueryResponse;
    readonly variables: SaleLotsListTestsQueryVariables;
};



/*
query SaleLotsListTestsQuery {
  me {
    ...SaleLotsList_me
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
  __isArtworkConnectionInterface: __typename
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
      __isNode: __typename
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

fragment SaleArtworkListItem_artwork on Artwork {
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
  image {
    small: url(version: "small")
    aspectRatio
    height
    width
  }
}

fragment SaleArtworkList_me on Me {
  lotsByFollowedArtistsConnection(first: 10, liveSale: true, isAuction: true) {
    edges {
      cursor
      node {
        internalID
        ...SaleArtworkListItem_artwork
        id
        __typename
      }
      id
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment SaleLotsList_me on Me {
  ...LotsByFollowedArtists_me
  ...SaleArtworkList_me
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  "liveSale",
  "isAuction"
],
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
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
  "type": "Int"
},
v8 = {
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
    "name": "SaleLotsListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SaleLotsList_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SaleLotsListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "SaleArtworksConnection",
            "kind": "LinkedField",
            "name": "lotsByFollowedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
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
                        "kind": "ScalarField",
                        "name": "title",
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
                        "kind": "ScalarField",
                        "name": "saleMessage",
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
                        "name": "artistNames",
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
                            "alias": "small",
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
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "height",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "width",
                            "storageKey": null
                          }
                        ],
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
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
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
                                    "value": "large"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"large\")"
                              }
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
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:10,isAuction:true,liveSale:true)"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": (v3/*: any*/),
            "handle": "connection",
            "key": "LotsByFollowedArtists_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": (v3/*: any*/),
            "handle": "connection",
            "key": "SaleArtworkList_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4021b9a63f518eac23382892f0be61bd",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworksConnection"
        },
        "me.lotsByFollowedArtistsConnection.__isArtworkConnectionInterface": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "me.lotsByFollowedArtistsConnection.edges.__isNode": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.__typename": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.cursor": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.__typename": (v5/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.artistNames": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.date": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.image.height": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.small": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.url": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.width": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.internalID": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.partner.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.name": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.sale.displayTimelyAt": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.endAt": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isAuction": (v8/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isClosed": (v8/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleMessage": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.slug": (v4/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.title": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.endCursor": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.startCursor": (v6/*: any*/)
      }
    },
    "name": "SaleLotsListTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c2ecb67a961ac81853985112e5400e6c';
export default node;
