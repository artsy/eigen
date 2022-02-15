/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d6ba79ba74aba724eb08852f5bff49b9 */

import { ConcreteRequest } from "relay-runtime";
export type RemoveAssetFromConsignmentSubmissionInput = {
    assetID?: string | null | undefined;
    clientMutationId?: string | null | undefined;
    sessionID?: string | null | undefined;
};
export type removeAssetFromConsignmentSubmissionMutationVariables = {
    input: RemoveAssetFromConsignmentSubmissionInput;
};
export type removeAssetFromConsignmentSubmissionMutationResponse = {
    readonly removeAssetFromConsignmentSubmission: {
        readonly asset: {
            readonly id: string;
        } | null;
    } | null;
};
export type removeAssetFromConsignmentSubmissionMutation = {
    readonly response: removeAssetFromConsignmentSubmissionMutationResponse;
    readonly variables: removeAssetFromConsignmentSubmissionMutationVariables;
};



/*
mutation removeAssetFromConsignmentSubmissionMutation(
  $input: RemoveAssetFromConsignmentSubmissionInput!
) {
  removeAssetFromConsignmentSubmission(input: $input) {
    asset {
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RemoveAssetFromConsignmentSubmissionPayload",
    "kind": "LinkedField",
    "name": "removeAssetFromConsignmentSubmission",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "removeAssetFromConsignmentSubmissionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "removeAssetFromConsignmentSubmissionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "d6ba79ba74aba724eb08852f5bff49b9",
    "metadata": {},
    "name": "removeAssetFromConsignmentSubmissionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '1843ec8e41ecb33b9f6a47bb0c5fa547';
export default node;
