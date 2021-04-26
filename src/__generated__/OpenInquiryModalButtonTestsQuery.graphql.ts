/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4fcca22e161479aa1bcf30e73f17426d */

import { ConcreteRequest } from "relay-runtime";
export type OpenInquiryModalButtonTestsQueryVariables = {
    artworkID: string;
};
export type OpenInquiryModalButtonTestsQueryResponse = {
    readonly artwork: {
        readonly isOfferableFromInquiry: boolean | null;
    } | null;
};
export type OpenInquiryModalButtonTestsQuery = {
    readonly response: OpenInquiryModalButtonTestsQueryResponse;
    readonly variables: OpenInquiryModalButtonTestsQueryVariables;
};



/*
query OpenInquiryModalButtonTestsQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    isOfferableFromInquiry
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isOfferableFromInquiry",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OpenInquiryModalButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "OpenInquiryModalButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
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
    ]
  },
  "params": {
    "id": "4fcca22e161479aa1bcf30e73f17426d",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "artwork.isOfferableFromInquiry": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "OpenInquiryModalButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '56a79a4b4d107ce04bca44693f8bc2dd';
export default node;
