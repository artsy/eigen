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
  ...CollectionArtworkPreview_collection
  ...CollectionArtworks_collection
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

fragment CollectionArtworkPreview_collection on MarketingCollection {
  artworks: artworksConnection(sort: "-merchandisability", first: 6) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
    id
  }
}

fragment CollectionArtworks_collection on MarketingCollection {
  slug
  id
  collectionArtworks: artworksConnection(sort: "-merchandisability", first: 9) {
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

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
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
  "alias": "aspect_ratio",
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v5 = {
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
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": "sale_message",
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": "is_biddable",
  "name": "isBiddable",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": "is_acquireable",
  "name": "isAcquireable",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": "is_offerable",
  "name": "isOfferable",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v12 = {
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
v13 = {
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
v14 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v3/*: any*/)
],
v15 = {
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
  "selections": (v14/*: any*/)
},
v16 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": (v14/*: any*/)
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v18 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 9
  },
  (v2/*: any*/)
],
v19 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v20 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v21 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v22 = {
  "type": "FilterArtworksConnection",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v23 = {
  "type": "FilterArtworksEdge",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v24 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v25 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v26 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v27 = {
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v28 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v29 = {
  "type": "Sale",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v30 = {
  "type": "SaleArtwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v31 = {
  "type": "Artist",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v32 = {
  "type": "Partner",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v33 = {
  "type": "SaleArtworkCurrentBid",
  "enumValues": null,
  "plural": false,
  "nullable": true
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
          {
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:6,sort:\"-merchandisability\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 6
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
                      (v3/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/)
                        ]
                      },
                      (v1/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/)
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          },
          (v11/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:9,sort:\"-merchandisability\")",
            "args": (v18/*: any*/),
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
                      (v11/*: any*/),
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
                          (v5/*: any*/),
                          (v4/*: any*/)
                        ]
                      },
                      (v1/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
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
            "args": (v18/*: any*/),
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "filters": [
              "sort"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionTestsQuery",
    "id": "3dbb866ab60a615edd38a2edc2e4d9e7",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.id": (v19/*: any*/),
        "marketingCollection.title": (v20/*: any*/),
        "marketingCollection.headerImage": (v21/*: any*/),
        "marketingCollection.image": (v22/*: any*/),
        "marketingCollection.artworks": (v22/*: any*/),
        "marketingCollection.slug": (v20/*: any*/),
        "marketingCollection.collectionArtworks": (v22/*: any*/),
        "marketingCollection.image.edges": (v23/*: any*/),
        "marketingCollection.image.id": (v24/*: any*/),
        "marketingCollection.artworks.edges": (v23/*: any*/),
        "marketingCollection.artworks.id": (v24/*: any*/),
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
        "marketingCollection.collectionArtworks.id": (v24/*: any*/),
        "marketingCollection.image.edges.node": (v25/*: any*/),
        "marketingCollection.artworks.edges.node": (v25/*: any*/),
        "marketingCollection.collectionArtworks.edges.node": (v25/*: any*/),
        "marketingCollection.image.edges.node.imageUrl": (v21/*: any*/),
        "marketingCollection.image.edges.node.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.id": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.id": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v20/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v21/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.image": (v26/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.__typename": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v26/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.image.aspect_ratio": (v27/*: any*/),
        "marketingCollection.artworks.edges.node.title": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.date": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.sale_message": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.is_biddable": (v28/*: any*/),
        "marketingCollection.artworks.edges.node.is_acquireable": (v28/*: any*/),
        "marketingCollection.artworks.edges.node.is_offerable": (v28/*: any*/),
        "marketingCollection.artworks.edges.node.slug": (v19/*: any*/),
        "marketingCollection.artworks.edges.node.sale": (v29/*: any*/),
        "marketingCollection.artworks.edges.node.sale_artwork": (v30/*: any*/),
        "marketingCollection.artworks.edges.node.artists": (v31/*: any*/),
        "marketingCollection.artworks.edges.node.partner": (v32/*: any*/),
        "marketingCollection.artworks.edges.node.href": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": (v27/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.title": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_message": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_biddable": (v28/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_acquireable": (v28/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_offerable": (v28/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale": (v29/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork": (v30/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists": (v31/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner": (v32/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.href": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.sale.is_auction": (v28/*: any*/),
        "marketingCollection.artworks.edges.node.sale.is_closed": (v28/*: any*/),
        "marketingCollection.artworks.edges.node.sale.display_timely_at": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.sale.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.sale_artwork.current_bid": (v33/*: any*/),
        "marketingCollection.artworks.edges.node.sale_artwork.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.image.url": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.artists.name": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.artists.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.partner.name": (v21/*: any*/),
        "marketingCollection.artworks.edges.node.partner.id": (v24/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_auction": (v28/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_closed": (v28/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.display_timely_at": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v24/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid": (v33/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.id": (v24/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.url": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspect_ratio": (v27/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.name": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.id": (v24/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v24/*: any*/),
        "marketingCollection.artworks.edges.node.sale_artwork.current_bid.display": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid.display": (v21/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
