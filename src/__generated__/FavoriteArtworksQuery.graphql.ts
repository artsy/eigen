/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FavoriteArtworksQueryVariables = {};
export type FavoriteArtworksQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Artworks_me">;
    } | null;
};
export type FavoriteArtworksQuery = {
    readonly response: FavoriteArtworksQueryResponse;
    readonly variables: FavoriteArtworksQueryVariables;
};



/*
query FavoriteArtworksQuery {
  me {
    ...Artworks_me
    id
  }
}

fragment Artworks_me on Me {
  followsAndSaves {
    artworks: artworksConnection(private: true, first: 10, after: "") {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          ...GenericGrid_artworks
          id
          __typename
        }
        cursor
      }
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "private",
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
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v1/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteArtworksQuery",
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
            "name": "Artworks_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteArtworksQuery",
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
            "name": "followsAndSaves",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowsAndSaves",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(after:\"\",first:10,private:true)",
                "args": (v0/*: any*/),
                "concreteType": "SavedArtworksConnection",
                "plural": false,
                "selections": [
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
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasPreviousPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
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
                    "concreteType": "SavedArtworksEdge",
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
                                "alias": "aspect_ratio",
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
                            "alias": "sale_message",
                            "name": "saleMessage",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_biddable",
                            "name": "isBiddable",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_acquireable",
                            "name": "isAcquireable",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_offerable",
                            "name": "isOfferable",
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
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": "is_auction",
                                "name": "isAuction",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "is_closed",
                                "name": "isClosed",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "display_timely_at",
                                "name": "displayTimelyAt",
                                "args": null,
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": "sale_artwork",
                            "name": "saleArtwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": "current_bid",
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
                              (v1/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artists",
                            "storageKey": "artists(shallow:true)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "shallow",
                                "value": true
                              }
                            ],
                            "concreteType": "Artist",
                            "plural": true,
                            "selections": (v2/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": (v2/*: any*/)
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
                            "name": "__typename",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artworks",
                "name": "artworksConnection",
                "args": (v0/*: any*/),
                "handle": "connection",
                "key": "GenericGrid_artworks",
                "filters": [
                  "private"
                ]
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FavoriteArtworksQuery",
    "id": "f1cec110977c7b8026cba7481b97d38d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4eee4601b64979e5357539469478d3ff';
export default node;
