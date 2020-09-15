/* tslint:disable */
/* eslint-disable */
/* @relayHash 5573d2f90ed51120f695ca6b27350a56 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkListQueryVariables = {};
export type MyCollectionArtworkListQueryResponse = {
    readonly me: {
        readonly id: string;
        readonly myCollectionConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly slug: string;
                    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkListItem_artwork">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type MyCollectionArtworkListQuery = {
    readonly response: MyCollectionArtworkListQueryResponse;
    readonly variables: MyCollectionArtworkListQueryVariables;
};



/*
query MyCollectionArtworkListQuery {
  me {
    id
    myCollectionConnection(first: 90) {
      edges {
        node {
          id
          slug
          ...MyCollectionArtworkListItem_artwork
          __typename
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  id
  internalID
  slug
  artistNames
  medium
  image {
    url
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v4 = {
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
      "name": "endCursor",
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
v5 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 90
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkListQuery",
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
          (v0/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "myCollectionConnection",
            "name": "__MyCollectionArtworkList_myCollectionConnection_connection",
            "storageKey": null,
            "args": null,
            "concreteType": "MyCollectionConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "MyCollectionEdge",
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
                      (v2/*: any*/),
                      {
                        "kind": "FragmentSpread",
                        "name": "MyCollectionArtworkListItem_artwork",
                        "args": null
                      }
                    ]
                  },
                  (v3/*: any*/)
                ]
              },
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkListQuery",
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
          (v0/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "myCollectionConnection",
            "storageKey": "myCollectionConnection(first:90)",
            "args": (v5/*: any*/),
            "concreteType": "MyCollectionConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "MyCollectionEdge",
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
                        "name": "medium",
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
                            "name": "url",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v2/*: any*/)
                    ]
                  },
                  (v3/*: any*/)
                ]
              },
              (v4/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "myCollectionConnection",
            "args": (v5/*: any*/),
            "handle": "connection",
            "key": "MyCollectionArtworkList_myCollectionConnection",
            "filters": []
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkListQuery",
    "id": "429f3ada193f492f1c0dbde47212e83b",
    "text": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "me",
            "myCollectionConnection"
          ]
        }
      ]
    }
  }
};
})();
(node as any).hash = 'e8f1a331d59ca6adecc49846ff4e1c5c';
export default node;
