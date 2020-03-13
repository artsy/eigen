/* tslint:disable */
/* eslint-disable */
/* @relayHash b86d7ae497181ed1659e6866a33d11cf */

import { ConcreteRequest } from "relay-runtime";
export type ConsignmentSubmissionCategoryAggregation = "ARCHITECTURE" | "DESIGN_DECORATIVE_ART" | "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER" | "FASHION_DESIGN_AND_WEARABLE_ART" | "INSTALLATION" | "JEWELRY" | "MIXED_MEDIA" | "OTHER" | "PAINTING" | "PERFORMANCE_ART" | "PHOTOGRAPHY" | "PRINT" | "SCULPTURE" | "TEXTILE_ARTS" | "VIDEO_FILM_ANIMATION" | "%future added value";
export type ConsignmentSubmissionStateAggregation = "APPROVED" | "DRAFT" | "REJECTED" | "SUBMITTED" | "%future added value";
export type UpdateSubmissionMutationInput = {
    clientMutationId?: string | null;
    id: string;
    additionalInfo?: string | null;
    artistID?: string | null;
    authenticityCertificate?: boolean | null;
    category?: ConsignmentSubmissionCategoryAggregation | null;
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
    width?: string | null;
    year?: string | null;
};
export type updateConsignmentSubmissionMutationVariables = {
    input: UpdateSubmissionMutationInput;
};
export type updateConsignmentSubmissionMutationResponse = {
    readonly updateConsignmentSubmission: {
        readonly consignmentSubmission: {
            readonly internalID: string | null;
        } | null;
    } | null;
};
export type updateConsignmentSubmissionMutation = {
    readonly response: updateConsignmentSubmissionMutationResponse;
    readonly variables: updateConsignmentSubmissionMutationVariables;
};



/*
mutation updateConsignmentSubmissionMutation(
  $input: UpdateSubmissionMutationInput!
) {
  updateConsignmentSubmission(input: $input) {
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
    "type": "UpdateSubmissionMutationInput!",
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
    "name": "updateConsignmentSubmissionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateSubmissionMutationPayload",
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
    "name": "updateConsignmentSubmissionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConsignmentSubmission",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateSubmissionMutationPayload",
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
    "name": "updateConsignmentSubmissionMutation",
    "id": "27f3c226b08051fc14a0ffbdb4c96b5c",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ce50d7bafbedce3436446f2e80197f61';
export default node;
