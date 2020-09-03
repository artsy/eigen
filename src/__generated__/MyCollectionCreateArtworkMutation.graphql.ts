/* tslint:disable */
/* eslint-disable */
/* @relayHash 315da9e4cec72a8e697b15d69061800a */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionCreateArtworkInput = {
    artistIds: Array<string | null>;
    clientMutationId?: string | null;
    date?: string | null;
    depth: string;
    height: string;
    medium: string;
    title?: string | null;
    width: string;
};
export type MyCollectionCreateArtworkMutationVariables = {
    input: MyCollectionCreateArtworkInput;
};
export type MyCollectionCreateArtworkMutationResponse = {
    readonly myCollectionCreateArtwork: {
        readonly artworkOrError: {
            readonly artworkEdge?: {
                readonly __id: string;
                readonly node: {
                    readonly artistNames: string | null;
                    readonly medium: string | null;
                    readonly internalID: string;
                    readonly slug: string;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type MyCollectionCreateArtworkMutation = {
    readonly response: MyCollectionCreateArtworkMutationResponse;
    readonly variables: MyCollectionCreateArtworkMutationVariables;
};



/*
mutation MyCollectionCreateArtworkMutation(
  $input: MyCollectionCreateArtworkInput!
) {
  myCollectionCreateArtwork(input: $input) {
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationSuccess {
        artworkEdge {
          node {
            artistNames
            medium
            internalID
            slug
            id
          }
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "MyCollectionCreateArtworkInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionCreateArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionCreateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworkOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "type": "MyCollectionArtworkMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworkEdge",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "plural": false,
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
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/)
                        ]
                      },
                      (v6/*: any*/)
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
    "name": "MyCollectionCreateArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionCreateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworkOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "MyCollectionArtworkMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworkEdge",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "plural": false,
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
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v6/*: any*/)
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
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionCreateArtworkMutation",
    "id": "19a3d41148c20554a06c4eb568fe174f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e91b9814c2e509da296e949d5bdee304';
export default node;
