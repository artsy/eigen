/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fd4f1ff25cf937f269558e95330ce314 */

import { ConcreteRequest } from "relay-runtime";
export type ConsignmentSubmissionCategoryAggregation = "ARCHITECTURE" | "DESIGN_DECORATIVE_ART" | "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER" | "FASHION_DESIGN_AND_WEARABLE_ART" | "INSTALLATION" | "JEWELRY" | "MIXED_MEDIA" | "OTHER" | "PAINTING" | "PERFORMANCE_ART" | "PHOTOGRAPHY" | "PRINT" | "SCULPTURE" | "TEXTILE_ARTS" | "VIDEO_FILM_ANIMATION" | "%future added value";
export type ConsignmentSubmissionStateAggregation = "APPROVED" | "DRAFT" | "REJECTED" | "SUBMITTED" | "%future added value";
export type CreateSubmissionMutationInput = {
    additionalInfo?: string | null;
    artistID: string;
    authenticityCertificate?: boolean | null;
    category?: ConsignmentSubmissionCategoryAggregation | null;
    clientMutationId?: string | null;
    currency?: string | null;
    depth?: string | null;
    dimensionsMetric?: string | null;
    edition?: boolean | null;
    editionNumber?: string | null;
    editionSize?: number | null;
    height?: string | null;
    locationCity?: string | null;
    locationCountry?: string | null;
    locationState?: string | null;
    medium?: string | null;
    minimumPriceDollars?: number | null;
    provenance?: string | null;
    signature?: boolean | null;
    sourceArtworkID?: string | null;
    state?: ConsignmentSubmissionStateAggregation | null;
    title?: string | null;
    userAgent?: string | null;
    width?: string | null;
    year?: string | null;
};
export type createConsignmentSubmissionMutationVariables = {
    input: CreateSubmissionMutationInput;
};
export type createConsignmentSubmissionMutationResponse = {
    readonly createConsignmentSubmission: {
        readonly consignmentSubmission: {
            readonly internalID: string | null;
        } | null;
    } | null;
};
export type createConsignmentSubmissionMutation = {
    readonly response: createConsignmentSubmissionMutationResponse;
    readonly variables: createConsignmentSubmissionMutationVariables;
};



/*
mutation createConsignmentSubmissionMutation(
  $input: CreateSubmissionMutationInput!
) {
  createConsignmentSubmission(input: $input) {
    consignmentSubmission {
      internalID
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
  "name": "internalID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "createConsignmentSubmissionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSubmissionMutationPayload",
        "kind": "LinkedField",
        "name": "createConsignmentSubmission",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ConsignmentSubmission",
            "kind": "LinkedField",
            "name": "consignmentSubmission",
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
    "name": "createConsignmentSubmissionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSubmissionMutationPayload",
        "kind": "LinkedField",
        "name": "createConsignmentSubmission",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ConsignmentSubmission",
            "kind": "LinkedField",
            "name": "consignmentSubmission",
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
    "id": "fd4f1ff25cf937f269558e95330ce314",
    "metadata": {},
    "name": "createConsignmentSubmissionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '960c9b16eb4c0b3f443f638be859c670';
export default node;
