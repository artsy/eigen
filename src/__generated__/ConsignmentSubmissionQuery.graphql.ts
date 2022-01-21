/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 07ccfd21e4f22282caa09c65e4df25e7 */

import { ConcreteRequest } from "relay-runtime";
export type ConsignmentSubmissionQueryVariables = {
    id: string;
};
export type ConsignmentSubmissionQueryResponse = {
    readonly submission: {
        readonly id: string;
        readonly artist: {
            readonly internalID: string;
            readonly name: string | null;
        } | null;
    } | null;
};
export type ConsignmentSubmissionQuery = {
    readonly response: ConsignmentSubmissionQueryResponse;
    readonly variables: ConsignmentSubmissionQueryVariables;
};



/*
query ConsignmentSubmissionQuery(
  $id: ID!
) {
  submission(id: $id) {
    id
    artist {
      internalID
      name
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
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConsignmentSubmissionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ConsignmentSubmission",
        "kind": "LinkedField",
        "name": "submission",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ConsignmentSubmissionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ConsignmentSubmission",
        "kind": "LinkedField",
        "name": "submission",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "07ccfd21e4f22282caa09c65e4df25e7",
    "metadata": {},
    "name": "ConsignmentSubmissionQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7bb905c01bf44c01de20c3601adfdbfc';
export default node;
