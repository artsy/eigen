/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type CreateGeminiEntryForAssetInput = {
    readonly sourceKey: string;
    readonly templateKey: string;
    readonly sourceBucket: string;
    readonly metadata: unknown;
    readonly clientMutationId?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateGeminiEntryForAssetInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createGeminiEntryForAsset",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateGeminiEntryForAssetPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "asset",
        "storageKey": null,
        "args": null,
        "concreteType": "GeminiEntry",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "token",
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
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "createGeminiAssetWithS3CredentialsMutation",
    "id": "55a8c7797e0ad70ce3351836d4745c74",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e15ca704c55d48b26d15b9be3a699c47';
export default node;
