/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type RequestConditionReportInput = {
    readonly clientMutationId?: string | null;
    readonly saleArtworkID: string;
};
export type RequestConditionReportMutationVariables = {
    input: RequestConditionReportInput;
};
export type RequestConditionReportMutationResponse = {
    readonly requestConditionReport: {
        readonly conditionReportRequest: {
            readonly internalID: string;
        };
    } | null;
};
export type RequestConditionReportMutation = {
    readonly response: RequestConditionReportMutationResponse;
    readonly variables: RequestConditionReportMutationVariables;
};



/*
mutation RequestConditionReportMutation(
  $input: RequestConditionReportInput!
) {
  requestConditionReport(input: $input) {
    conditionReportRequest {
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
    "type": "RequestConditionReportInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "requestConditionReport",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RequestConditionReportPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "conditionReportRequest",
        "storageKey": null,
        "args": null,
        "concreteType": "ConditionReportRequest",
        "plural": false,
        "selections": [
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
    "name": "RequestConditionReportMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "RequestConditionReportMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "RequestConditionReportMutation",
    "id": "6f7779c4698ec556295c193d58013649",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '99b29530296311d1183354c3082e3055';
export default node;
