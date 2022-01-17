/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash be5e00d838325946d28da5809a78b573 */

import { ConcreteRequest } from "relay-runtime";
export type ConsignmentAttributionClass = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION" | "%future added value";
export type ConsignmentSubmissionCategoryAggregation = "ARCHITECTURE" | "DESIGN_DECORATIVE_ART" | "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER" | "FASHION_DESIGN_AND_WEARABLE_ART" | "INSTALLATION" | "JEWELRY" | "MIXED_MEDIA" | "OTHER" | "PAINTING" | "PERFORMANCE_ART" | "PHOTOGRAPHY" | "PRINT" | "SCULPTURE" | "TEXTILE_ARTS" | "VIDEO_FILM_ANIMATION" | "%future added value";
export type ConsignmentSubmissionStateAggregation = "APPROVED" | "DRAFT" | "REJECTED" | "SUBMITTED" | "%future added value";
export type CreateSubmissionMutationInput = {
    additionalInfo?: string | null | undefined;
    artistID: string;
    attributionClass?: ConsignmentAttributionClass | null | undefined;
    authenticityCertificate?: boolean | null | undefined;
    category?: ConsignmentSubmissionCategoryAggregation | null | undefined;
    clientMutationId?: string | null | undefined;
    coaByAuthenticatingBody?: boolean | null | undefined;
    coaByGallery?: boolean | null | undefined;
    currency?: string | null | undefined;
    depth?: string | null | undefined;
    dimensionsMetric?: string | null | undefined;
    edition?: boolean | null | undefined;
    editionNumber?: string | null | undefined;
    editionSize?: number | null | undefined;
    editionSizeFormatted?: string | null | undefined;
    height?: string | null | undefined;
    locationCity?: string | null | undefined;
    locationCountry?: string | null | undefined;
    locationState?: string | null | undefined;
    medium?: string | null | undefined;
    minimumPriceDollars?: number | null | undefined;
    provenance?: string | null | undefined;
    sessionID?: string | null | undefined;
    signature?: boolean | null | undefined;
    sourceArtworkID?: string | null | undefined;
    state?: ConsignmentSubmissionStateAggregation | null | undefined;
    title?: string | null | undefined;
    userAgent?: string | null | undefined;
    userEmail?: string | null | undefined;
    userName?: string | null | undefined;
    userPhone?: string | null | undefined;
    utmMedium?: string | null | undefined;
    utmSource?: string | null | undefined;
    utmTerm?: string | null | undefined;
    width?: string | null | undefined;
    year?: string | null | undefined;
};
export type createConsignSubmissionMutationVariables = {
    input: CreateSubmissionMutationInput;
};
export type createConsignSubmissionMutationResponse = {
    readonly createConsignmentSubmission: {
        readonly consignmentSubmission: {
            readonly internalID: string | null;
        } | null;
    } | null;
};
export type createConsignSubmissionMutation = {
    readonly response: createConsignSubmissionMutationResponse;
    readonly variables: createConsignSubmissionMutationVariables;
};



/*
mutation createConsignSubmissionMutation(
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
    "name": "createConsignSubmissionMutation",
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
    "name": "createConsignSubmissionMutation",
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
    "id": "be5e00d838325946d28da5809a78b573",
    "metadata": {},
    "name": "createConsignSubmissionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '7ad5485f572f4ae882d2105cadd9f64c';
export default node;
