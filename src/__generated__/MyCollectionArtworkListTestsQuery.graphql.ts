/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ca8ccf80f1ef0339bd65eedb7b7a391a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkListTestsQueryVariables = {};
export type MyCollectionArtworkListTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkList_me">;
    } | null;
};
export type MyCollectionArtworkListTestsQuery = {
    readonly response: MyCollectionArtworkListTestsQueryResponse;
    readonly variables: MyCollectionArtworkListTestsQueryVariables;
};



/*
query MyCollectionArtworkListTestsQuery {
  me {
    ...MyCollectionArtworkList_me
    id
  }
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  artist {
    internalID
    id
  }
  artistNames
  category
  costMinor
  costCurrencyCode
  date
  depth
  editionSize
  editionNumber
  height
  id
  images {
    isDefault
    url
    width
    height
  }
  internalID
  medium
  metric
  slug
  title
  width
}

fragment MyCollectionArtworkList_me on Me {
  id
  myCollectionConnection(first: 20, sort: CREATED_AT_DESC) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        slug
        ...MyCollectionArtworkListItem_artwork
        __typename
      }
      cursor
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
    "value": 20
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
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
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
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkListTestsQuery",
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
            "name": "MyCollectionArtworkList_me"
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
    "name": "MyCollectionArtworkListTestsQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "MyCollectionConnection",
            "kind": "LinkedField",
            "name": "myCollectionConnection",
            "plural": false,
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
                    "name": "hasNextPage",
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
              },
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
                        "name": "slug",
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
                          (v2/*: any*/),
                          (v0/*: any*/)
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
                        "kind": "ScalarField",
                        "name": "category",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "costMinor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "costCurrencyCode",
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
                        "name": "depth",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "editionSize",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "editionNumber",
                        "storageKey": null
                      },
                      (v3/*: any*/),
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
                            "name": "isDefault",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/),
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
                        "name": "metric",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
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
              }
            ],
            "storageKey": "myCollectionConnection(first:20,sort:\"CREATED_AT_DESC\")"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": [],
            "handle": "connection",
            "key": "MyCollectionArtworkList_myCollectionConnection",
            "kind": "LinkedHandle",
            "name": "myCollectionConnection"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ca8ccf80f1ef0339bd65eedb7b7a391a",
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
        "me.myCollectionConnection.edges.node.artistNames": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.category": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.costCurrencyCode": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.costMinor": (v8/*: any*/),
        "me.myCollectionConnection.edges.node.date": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.depth": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.editionNumber": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.editionSize": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.height": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.id": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "me.myCollectionConnection.edges.node.images.height": (v8/*: any*/),
        "me.myCollectionConnection.edges.node.images.isDefault": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "me.myCollectionConnection.edges.node.images.url": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.images.width": (v8/*: any*/),
        "me.myCollectionConnection.edges.node.internalID": (v5/*: any*/),
        "me.myCollectionConnection.edges.node.medium": (v7/*: any*/),
        "me.myCollectionConnection.edges.node.metric": (v7/*: any*/),
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
        "me.myCollectionConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "MyCollectionArtworkListTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7e4a91294c292a8fc730d4e466ccec68';
export default node;
