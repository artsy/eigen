/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 55a8c7797e0ad70ce3351836d4745c74 */

import { ConcreteRequest } from "relay-runtime";
export type CreateGeminiEntryForAssetInput = {
    clientMutationId?: string | null;
    metadata: unknown;
    sourceBucket: string;
    sourceKey: string;
    templateKey: string;
};
export type createGeminiAssetWithS3CredentialsMutationVariables = {
    input: CreateGeminiEntryForAssetInput;
};
export type createGeminiAssetWithS3CredentialsMutationResponse = {
    readonly createGeminiEntryForAsset: {
        readonly asset: {
            readonly token: string;
        } | null;
    } | null;
};
export type createGeminiAssetWithS3CredentialsMutation = {
    readonly response: createGeminiAssetWithS3CredentialsMutationResponse;
    readonly variables: createGeminiAssetWithS3CredentialsMutationVariables;
};



/*
mutation createGeminiAssetWithS3CredentialsMutation(
  $input: CreateGeminiEntryForAssetInput!
) {
  createGeminiEntryForAsset(input: $input) {
    asset {
      token
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateGeminiEntryForAssetPayload",
    "kind": "LinkedField",
    "name": "createGeminiEntryForAsset",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "GeminiEntry",
        "kind": "LinkedField",
        "name": "asset",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "token",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "55a8c7797e0ad70ce3351836d4745c74",
    "metadata": {},
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'e15ca704c55d48b26d15b9be3a699c47';
export default node;
