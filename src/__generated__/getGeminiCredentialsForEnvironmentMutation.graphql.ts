/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type RequestCredentialsForAssetUploadInput = {
    readonly name: string;
    readonly acl: string;
    readonly clientMutationId?: string | null;
};
export type getGeminiCredentialsForEnvironmentMutationVariables = {
    readonly input: RequestCredentialsForAssetUploadInput;
};
export type getGeminiCredentialsForEnvironmentMutationResponse = {
    readonly requestCredentialsForAssetUpload: {
        readonly asset: {
            readonly signature: string;
            readonly credentials: string;
            readonly policyEncoded: string;
            readonly policyDocument: {
                readonly expiration: string;
                readonly conditions: {
                    readonly acl: string;
                    readonly bucket: string;
                    readonly geminiKey: string;
                    readonly successActionStatus: string;
                };
            };
        } | null;
    } | null;
};
export type getGeminiCredentialsForEnvironmentMutation = {
    readonly response: getGeminiCredentialsForEnvironmentMutationResponse;
    readonly variables: getGeminiCredentialsForEnvironmentMutationVariables;
};



/*
mutation getGeminiCredentialsForEnvironmentMutation(
  $input: RequestCredentialsForAssetUploadInput!
) {
  requestCredentialsForAssetUpload(input: $input) {
    asset {
      signature
      credentials
      policyEncoded
      policyDocument {
        expiration
        conditions {
          acl
          bucket
          geminiKey
          successActionStatus
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
    "type": "RequestCredentialsForAssetUploadInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "requestCredentialsForAssetUpload",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RequestCredentialsForAssetUploadPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "asset",
        "storageKey": null,
        "args": null,
        "concreteType": "Credentials",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "signature",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "credentials",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "policyEncoded",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "policyDocument",
            "storageKey": null,
            "args": null,
            "concreteType": "S3PolicyDocumentType",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "expiration",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "conditions",
                "storageKey": null,
                "args": null,
                "concreteType": "S3PolicyConditionsType",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "acl",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "bucket",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "geminiKey",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "successActionStatus",
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
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "getGeminiCredentialsForEnvironmentMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "getGeminiCredentialsForEnvironmentMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "getGeminiCredentialsForEnvironmentMutation",
    "id": "390163a2c0e0d6080e2fc0a6780e2530",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a0cc2049b62b05a1c93d0cae69fcda7a';
export default node;
