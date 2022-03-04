/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 00ad4814ca563fe4c265855689bb84bc */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionTestsQueryVariables = {};
export type MyCollectionTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollection_me">;
    } | null;
};
export type MyCollectionTestsQuery = {
    readonly response: MyCollectionTestsQueryResponse;
    readonly variables: MyCollectionTestsQueryVariables;
};



/*
query MyCollectionTestsQuery {
  me {
    ...MyCollection_me
    id
  }
}

fragment InfiniteScrollArtworksGrid_myCollectionConnection_15nBhX on MyCollectionConnection {
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    node {
      title
      slug
      id
      image {
        aspectRatio
      }
      artistNames
      medium
      artist {
        internalID
        name
        id
      }
      pricePaid {
        minor
      }
      sizeBucket
      width
      height
      date
      ...MyCollectionArtworkGridItem_artwork
    }
  }
}

fragment MyCollectionArtworkGridItem_artwork on Artwork {
  internalID
  artist {
    internalID
    targetSupply {
      isTargetSupply
    }
    id
  }
  artists {
    targetSupply {
      isTargetSupply
    }
    id
  }
  images {
    url
    isDefault
  }
  image {
    aspectRatio
  }
  artistNames
  medium
  slug
  title
  date
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  internalID
  title
  slug
  id
  medium
  image {
    url(version: "small")
    aspectRatio
  }
  artistNames
  artist {
    internalID
    name
    targetSupply {
      isTargetSupply
    }
    id
  }
  artists {
    targetSupply {
      isTargetSupply
    }
    id
  }
  pricePaid {
    minor
  }
  sizeBucket
  width
  height
  date
}

fragment MyCollectionArtworkList_myCollectionConnection on MyCollectionConnection {
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    node {
      ...MyCollectionArtworkListItem_artwork
      title
      slug
      id
      artistNames
      medium
      artist {
        internalID
        name
        id
      }
      pricePaid {
        minor
      }
      sizeBucket
      width
      height
      date
    }
  }
}

fragment MyCollection_me on Me {
  id
  myCollectionInfo {
    includesPurchasedArtworks
  }
  myCollectionConnection(first: 30, sort: CREATED_AT_DESC) {
    edges {
      node {
        id
        medium
        title
        pricePaid {
          minor
        }
        attributionClass {
          name
          id
        }
        sizeBucket
        width
        height
        artist {
          internalID
          name
          id
        }
        consignmentSubmission {
          displayText
        }
        __typename
      }
      cursor
    }
    ...MyCollectionArtworkList_myCollectionConnection
    ...InfiniteScrollArtworksGrid_myCollectionConnection_15nBhX
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "CREATED_AT_DESC"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "ArtistTargetSupply",
  "kind": "LinkedField",
  "name": "targetSupply",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isTargetSupply",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v7 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ArtistTargetSupply"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionTestsQuery",
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
            "name": "MyCollection_me"
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
    "name": "MyCollectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MyCollectionInfo",
            "kind": "LinkedField",
            "name": "myCollectionInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "includesPurchasedArtworks",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "MyCollectionConnection",
            "kind": "LinkedField",
            "name": "myCollectionConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MyCollectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
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
                        "name": "title",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Money",
                        "kind": "LinkedField",
                        "name": "pricePaid",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "minor",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AttributionClass",
                        "kind": "LinkedField",
                        "name": "attributionClass",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v0/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "sizeBucket",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "width",
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
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v2/*: any*/),
                          (v0/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkConsignmentSubmission",
                        "kind": "LinkedField",
                        "name": "consignmentSubmission",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "displayText",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      },
                      (v3/*: any*/),
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
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          }
                        ],
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
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artists",
                        "plural": true,
                        "selections": [
                          (v4/*: any*/),
                          (v0/*: any*/)
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
                        "name": "images",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isDefault",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
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
                    "name": "hasNextPage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "myCollectionConnection(first:30,sort:\"CREATED_AT_DESC\")"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": [],
            "handle": "connection",
            "key": "MyCollection_myCollectionConnection",
            "kind": "LinkedHandle",
            "name": "myCollectionConnection"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "00ad4814ca563fe4c265855689bb84bc",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v5/*: any*/),
        "me.myCollectionConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyCollectionConnection"
        },
        "me.myCollectionConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "MyCollectionEdge"
        },
        "me.myCollectionConnection.edges.cursor": (v6/*: any*/),
        "me.myCollectionConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "me.myCollectionConnection.edges.node.__typename": (v6/*: any*/),
        "me.myCollectionConnection.edges.node.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "me.myCollectionConnection.edges.node.artist.id": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.artist.internalID": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.artist.name": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.artist.targetSupply": (v8/*: any*/),
        "me.myCollectionConnection.edges.node.artist.targetSupply.isTargetSupply": (v9/*: any*/),
        "me.myCollectionConnection.edges.node.artistNames": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.artists": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Artist"
        },
        "me.myCollectionConnection.edges.node.artists.id": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.artists.targetSupply": (v8/*: any*/),
        "me.myCollectionConnection.edges.node.artists.targetSupply.isTargetSupply": (v9/*: any*/),
        "me.myCollectionConnection.edges.node.attributionClass": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AttributionClass"
        },
        "me.myCollectionConnection.edges.node.attributionClass.id": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.attributionClass.name": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.consignmentSubmission": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConsignmentSubmission"
        },
        "me.myCollectionConnection.edges.node.consignmentSubmission.displayText": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.date": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.height": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.id": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.myCollectionConnection.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "me.myCollectionConnection.edges.node.image.url": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "me.myCollectionConnection.edges.node.images.isDefault": (v9/*: any*/),
        "me.myCollectionConnection.edges.node.images.url": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.internalID": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.medium": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.pricePaid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Money"
        },
        "me.myCollectionConnection.edges.node.pricePaid.minor": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "me.myCollectionConnection.edges.node.sizeBucket": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.slug": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.title": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.width": (v7/*: any*/),
        "me.myCollectionConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.myCollectionConnection.pageInfo.endCursor": (v7/*: any*/),
        "me.myCollectionConnection.pageInfo.hasNextPage": (v10/*: any*/),
        "me.myCollectionConnection.pageInfo.startCursor": (v7/*: any*/),
        "me.myCollectionInfo": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyCollectionInfo"
        },
        "me.myCollectionInfo.includesPurchasedArtworks": (v10/*: any*/)
      }
    },
    "name": "MyCollectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f92871534f578770b84dd56aca4132bc';
export default node;
