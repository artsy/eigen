/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionTestsQueryVariables = {};
export type CollectionTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"Collection_collection">;
    } | null;
};
export type CollectionTestsQuery = {
    readonly response: CollectionTestsQueryResponse;
    readonly variables: CollectionTestsQueryVariables;
};



/*
query CollectionTestsQuery {
  marketingCollection(slug: "doesn't matter") {
    ...Collection_collection
    id
  }
}

fragment Collection_collection on MarketingCollection {
  ...CollectionHeader_collection
  ...CollectionArtworks_collection
  ...FeaturedArtists_collection
}

fragment CollectionHeader_collection on MarketingCollection {
  title
  headerImage
  image: artworksConnection(sort: "-merchandisability", first: 1) {
    edges {
      node {
        imageUrl
        id
      }
    }
    id
  }
}

fragment CollectionArtworks_collection on MarketingCollection {
  slug
  id
  collectionArtworks: artworksConnection(sort: "-merchandisability", first: 6) {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment FeaturedArtists_collection on MarketingCollection {
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 9, sort: "-decayed_merch") {
    merchandisableArtists {
      slug
      internalID
      name
      image {
        resized(width: 100) {
          url
        }
      }
      birthday
      nationality
      isFollowed
      id
    }
    id
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
    "name": "slug",
    "value": "doesn't matter"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-merchandisability"
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  (v2/*: any*/)
],
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = [
  (v6/*: any*/),
  (v3/*: any*/)
],
v8 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v9 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v10 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v11 = {
  "type": "FilterArtworksConnection",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v12 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v13 = {
  "type": "Artist",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v14 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v15 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v16 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v17 = {
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": false
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CollectionTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Collection_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "headerImage",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "image",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1,sort:\"-merchandisability\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              },
              (v2/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "imageUrl",
                        "args": null,
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          },
          (v4/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:6,sort:\"-merchandisability\")",
            "args": (v5/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
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
                      (v3/*: any*/),
                      (v4/*: any*/),
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
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "aspect_ratio",
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v1/*: any*/),
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
                          (v3/*: any*/)
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
                          (v3/*: any*/)
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
                        "selections": (v7/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v7/*: any*/)
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
                  },
                  (v3/*: any*/)
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
              },
              (v3/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "args": (v5/*: any*/),
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "filters": [
              "sort"
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworksConnection",
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:9,sort:\"-decayed_merch\")",
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MERCHANDISABLE_ARTISTS"
                ]
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 9
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-decayed_merch"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "merchandisableArtists",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
                    "args": null,
                    "storageKey": null
                  },
                  (v6/*: any*/),
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
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "resized",
                        "storageKey": "resized(width:100)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "width",
                            "value": 100
                          }
                        ],
                        "concreteType": "ResizedImageUrl",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "birthday",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "nationality",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionTestsQuery",
    "id": "47e95cdc098e1b1e1ff07d474f25b252",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.id": (v8/*: any*/),
        "marketingCollection.title": (v9/*: any*/),
        "marketingCollection.headerImage": (v10/*: any*/),
        "marketingCollection.image": (v11/*: any*/),
        "marketingCollection.slug": (v9/*: any*/),
        "marketingCollection.collectionArtworks": (v11/*: any*/),
        "marketingCollection.artworksConnection": (v11/*: any*/),
        "marketingCollection.image.edges": {
          "type": "FilterArtworksEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.image.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges": {
          "type": "ArtworkEdgeInterface",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.pageInfo": {
          "type": "PageInfo",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.id": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists": (v13/*: any*/),
        "marketingCollection.artworksConnection.id": (v12/*: any*/),
        "marketingCollection.image.edges.node": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.slug": (v8/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.internalID": (v8/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.name": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image": (v15/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.birthday": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.nationality": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.isFollowed": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.id": (v12/*: any*/),
        "marketingCollection.image.edges.node.imageUrl": (v10/*: any*/),
        "marketingCollection.image.edges.node.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.id": (v8/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v9/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v10/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.resized": {
          "type": "ResizedImageUrl",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.__typename": (v9/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v8/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.resized.url": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.title": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_message": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_biddable": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_acquireable": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_offerable": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.sale_artwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.artists": (v13/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.href": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_auction": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_closed": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.display_timely_at": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.url": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspect_ratio": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.name": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid.display": (v10/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
