/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 623bbe0f804e946ff688616d607f4bd2 */

import { ConcreteRequest } from "relay-runtime";
export type AddAssetToConsignmentSubmissionInput = {
    assetType?: string | null;
    clientMutationId?: string | null;
    geminiToken: string;
    submissionID: string;
};
export type addAssetToConsignmentMutationVariables = {
    input: AddAssetToConsignmentSubmissionInput;
};
export type addAssetToConsignmentMutationResponse = {
    readonly addAssetToConsignmentSubmission: {
        readonly asset: {
            readonly submissionID: string | null;
        } | null;
    } | null;
};
export type addAssetToConsignmentMutation = {
    readonly response: addAssetToConsignmentMutationResponse;
    readonly variables: addAssetToConsignmentMutationVariables;
};



/*
mutation addAssetToConsignmentMutation(
  $input: AddAssetToConsignmentSubmissionInput!
) {
  addAssetToConsignmentSubmission(input: $input) {
    asset {
      submissionID
      id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "submissionID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "addAssetToConsignmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToConsignmentSubmissionPayload",
        "kind": "LinkedField",
        "name": "addAssetToConsignmentSubmission",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ConsignmentSubmissionCategoryAsset",
            "kind": "LinkedField",
            "name": "asset",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "addAssetToConsignmentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToConsignmentSubmissionPayload",
        "kind": "LinkedField",
        "name": "addAssetToConsignmentSubmission",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ConsignmentSubmissionCategoryAsset",
            "kind": "LinkedField",
            "name": "asset",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "623bbe0f804e946ff688616d607f4bd2",
    "metadata": {},
    "name": "addAssetToConsignmentMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '978fb7b6934654ffbae949e10f3d64d1';
export default node;
