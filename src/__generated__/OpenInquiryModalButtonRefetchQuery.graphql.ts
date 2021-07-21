/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 97b950c26c067f533fb4e54f61baa9e2 */

import { ConcreteRequest } from "relay-runtime";
export type OpenInquiryModalButtonRefetchQueryVariables = {
    artworkID: string;
};
export type OpenInquiryModalButtonRefetchQueryResponse = {
    readonly artwork: {
        readonly isOfferableFromInquiry: boolean | null;
    } | null;
};
export type OpenInquiryModalButtonRefetchQuery = {
    readonly response: OpenInquiryModalButtonRefetchQueryResponse;
    readonly variables: OpenInquiryModalButtonRefetchQueryVariables;
};



/*
query OpenInquiryModalButtonRefetchQuery(
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
    "name": "OpenInquiryModalButtonRefetchQuery",
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
    "name": "OpenInquiryModalButtonRefetchQuery",
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
    "id": "97b950c26c067f533fb4e54f61baa9e2",
    "metadata": {},
    "name": "OpenInquiryModalButtonRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c9a88b826d5ae1ff9a7afab2c73bfb8e';
export default node;
