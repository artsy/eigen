/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 63194f0a6a98703dcf55c36ca801cf39 */

import { ConcreteRequest } from "relay-runtime";
export type RecordArtworkViewInput = {
    artwork_id: string;
    clientMutationId?: string | null;
};
export type ArtworkMarkAsRecentlyViewedQueryVariables = {
    input: RecordArtworkViewInput;
};
export type ArtworkMarkAsRecentlyViewedQueryResponse = {
    readonly recordArtworkView: {
        readonly artworkId: string;
    } | null;
};
export type ArtworkMarkAsRecentlyViewedQuery = {
    readonly response: ArtworkMarkAsRecentlyViewedQueryResponse;
    readonly variables: ArtworkMarkAsRecentlyViewedQueryVariables;
};



/*
mutation ArtworkMarkAsRecentlyViewedQuery(
  $input: RecordArtworkViewInput!
) {
  recordArtworkView(input: $input) {
    artworkId
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
    "concreteType": "RecordArtworkViewPayload",
    "kind": "LinkedField",
    "name": "recordArtworkView",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "artworkId",
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
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "63194f0a6a98703dcf55c36ca801cf39",
    "metadata": {},
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '4ddb094d53cb9316e9302947e1ff20c3';
export default node;
