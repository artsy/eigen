/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type AddAssetToConsignmentSubmissionInput = {
    readonly assetType: string;
    readonly geminiToken: string;
    readonly submissionID: string;
    readonly clientMutationId?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddAssetToConsignmentSubmissionInput!",
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
  "name": "submissionID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "addAssetToConsignmentMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addAssetToConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToConsignmentSubmissionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "asset",
            "storageKey": null,
            "args": null,
            "concreteType": "Asset",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "addAssetToConsignmentMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addAssetToConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssetToConsignmentSubmissionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "asset",
            "storageKey": null,
            "args": null,
            "concreteType": "Asset",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "addAssetToConsignmentMutation",
    "id": "623bbe0f804e946ff688616d607f4bd2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '978fb7b6934654ffbae949e10f3d64d1';
export default node;
