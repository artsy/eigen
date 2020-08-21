/* tslint:disable */
/* eslint-disable */
/* @relayHash 8d145d44ad602c829f52a25ce3a4c1ad */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkListQueryVariables = {};
export type MyCollectionArtworkListQueryResponse = {
    readonly me: {
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
    myCollectionConnection(first: 10) {
      edges {
        node {
          id
          slug
          ...MyCollectionArtworkListItem_artwork
        }
      }
    }
    id
  }
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  id
  slug
  artistNames
  medium
  image {
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
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
};
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "myCollectionConnection",
            "storageKey": "myCollectionConnection(first:10)",
            "args": (v0/*: any*/),
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
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "FragmentSpread",
                        "name": "MyCollectionArtworkListItem_artwork",
                        "args": null
                      }
                    ]
                  }
                ]
              }
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "myCollectionConnection",
            "storageKey": "myCollectionConnection(first:10)",
            "args": (v0/*: any*/),
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
                      (v1/*: any*/),
                      (v2/*: any*/),
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
                      }
                    ]
                  }
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
    "name": "MyCollectionArtworkListQuery",
    "id": "0d8a4cae99c367350d983a7f2db07baf",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6134510b28920e9d895bb6f2d5105ab3';
export default node;
