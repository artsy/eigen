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
  id
  slug
  ...CollectionHeader_collection_Z952l
  ...CollectionArtworks_collection
  ...FeaturedArtists_collection
}

fragment CollectionHeader_collection_Z952l on MarketingCollection {
  title
  headerImage
  descriptionMarkdown
  image: artworksConnection(sort: "-decayed_merch", first: 1) {
    edges {
      node {
        image {
          resized(width: 500, height: 204) {
            url
          }
        }
        id
      }
    }
    id
  }
}

fragment CollectionArtworks_collection on MarketingCollection {
  slug
  id
  collectionArtworks: artworksConnection(sort: "-decayed_merch", first: 6) {
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
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
    merchandisableArtists(size: 9) {
      internalID
      ...ArtistListItem_artist
      id
    }
    id
  }
  query {
    artistIDs
    id
  }
  featuredArtistExclusionIds
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-decayed_merch"
},
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  (v4/*: any*/)
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = [
  (v7/*: any*/),
  (v1/*: any*/)
],
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v10 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v11 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v12 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v13 = {
  "type": "FilterArtworksConnection",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v14 = {
  "type": "String",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v15 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v16 = {
  "type": "Artist",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v17 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v18 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v19 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v20 = {
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "headerImage",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "descriptionMarkdown",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "image",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              },
              (v4/*: any*/)
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
                            "storageKey": "resized(height:204,width:500)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "height",
                                "value": 204
                              },
                              {
                                "kind": "Literal",
                                "name": "width",
                                "value": 500
                              }
                            ],
                            "concreteType": "ResizedImageUrl",
                            "plural": false,
                            "selections": (v5/*: any*/)
                          }
                        ]
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
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:6,sort:\"-decayed_merch\")",
            "args": (v6/*: any*/),
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
                      (v1/*: any*/),
                      (v2/*: any*/),
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
                      (v3/*: any*/),
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
                        "selections": (v8/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v8/*: any*/)
                      },
                      (v9/*: any*/),
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
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "args": (v6/*: any*/),
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
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")",
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
                "value": 0
              },
              (v4/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "merchandisableArtists",
                "storageKey": "merchandisableArtists(size:9)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 9
                  }
                ],
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v7/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "initials",
                    "args": null,
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "is_followed",
                    "name": "isFollowed",
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
                    "name": "birthday",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "deathday",
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
                    "selections": (v5/*: any*/)
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "query",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionQuery",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artistIDs",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "featuredArtistExclusionIds",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionTestsQuery",
    "id": "fd0516f2749e8428ea5919adccf3eb10",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.id": (v10/*: any*/),
        "marketingCollection.slug": (v11/*: any*/),
        "marketingCollection.title": (v11/*: any*/),
        "marketingCollection.headerImage": (v12/*: any*/),
        "marketingCollection.descriptionMarkdown": (v12/*: any*/),
        "marketingCollection.image": (v13/*: any*/),
        "marketingCollection.collectionArtworks": (v13/*: any*/),
        "marketingCollection.artworksConnection": (v13/*: any*/),
        "marketingCollection.query": {
          "type": "MarketingCollectionQuery",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.featuredArtistExclusionIds": (v14/*: any*/),
        "marketingCollection.image.edges": {
          "type": "FilterArtworksEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.image.id": (v15/*: any*/),
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
        "marketingCollection.collectionArtworks.id": (v15/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists": (v16/*: any*/),
        "marketingCollection.artworksConnection.id": (v15/*: any*/),
        "marketingCollection.query.artistIDs": (v14/*: any*/),
        "marketingCollection.query.id": (v15/*: any*/),
        "marketingCollection.image.edges.node": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.internalID": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.id": (v10/*: any*/),
        "marketingCollection.image.edges.node.image": (v18/*: any*/),
        "marketingCollection.image.edges.node.id": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.id": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v11/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v12/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.slug": (v10/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.name": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.initials": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.href": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.is_followed": (v19/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.nationality": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.birthday": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.deathday": (v12/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image": (v18/*: any*/),
        "marketingCollection.image.edges.node.image.resized": {
          "type": "ResizedImageUrl",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.__typename": (v11/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v10/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v15/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.url": (v12/*: any*/),
        "marketingCollection.image.edges.node.image.resized.url": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.title": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_message": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_biddable": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_acquireable": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_offerable": (v19/*: any*/),
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
        "marketingCollection.collectionArtworks.edges.node.artists": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.href": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_auction": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_closed": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.display_timely_at": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.id": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.url": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspect_ratio": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.name": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.id": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v15/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid.display": (v12/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
