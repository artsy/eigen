/* tslint:disable */
/* eslint-disable */
/* @relayHash 06c15b22996b5bfde3986fe2c60fb9f8 */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionCreateArtworkInput = {
    artistIds: Array<string | null>;
    clientMutationId?: string | null;
    dimensions: string;
    medium: string;
};
export type MyCollectionCreateArtworkMutationVariables = {
    input: MyCollectionCreateArtworkInput;
};
export type MyCollectionCreateArtworkMutationResponse = {
    readonly myCollectionCreateArtwork: {
        readonly artwork: {
            readonly medium: string | null;
            readonly id: string;
            readonly internalID: string;
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
    artwork {
      medium
      id
      internalID
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
    "kind": "LinkedField",
    "alias": null,
    "name": "myCollectionCreateArtwork",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MyCollectionCreateArtworkPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": null,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionCreateArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionCreateArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionCreateArtworkMutation",
    "id": "f3a2d2d8baaf49c7b2dd545473f71202",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '5686ce079b546dc871252bbb38921ec2';
export default node;
