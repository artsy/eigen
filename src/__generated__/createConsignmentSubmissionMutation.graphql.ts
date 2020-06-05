/* tslint:disable */
/* eslint-disable */
/* @relayHash 7e27f6d17d90c9052b81e9866aa8673e */

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
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateSubmissionMutationInput!",
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
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "createConsignmentSubmissionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSubmissionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "consignmentSubmission",
            "storageKey": null,
            "args": null,
            "concreteType": "ConsignmentSubmission",
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
    "name": "createConsignmentSubmissionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSubmissionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "consignmentSubmission",
            "storageKey": null,
            "args": null,
            "concreteType": "ConsignmentSubmission",
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
    "name": "createConsignmentSubmissionMutation",
    "id": "fd4f1ff25cf937f269558e95330ce314",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '960c9b16eb4c0b3f443f638be859c670';
export default node;
