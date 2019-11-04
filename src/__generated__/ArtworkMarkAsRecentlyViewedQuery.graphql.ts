/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type RecordArtworkViewInput = {
    readonly artwork_id: string;
    readonly clientMutationId?: string | null;
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "RecordArtworkViewInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "recordArtworkView",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RecordArtworkViewPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "artworkId",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtworkMarkAsRecentlyViewedQuery",
    "id": "63194f0a6a98703dcf55c36ca801cf39",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4ddb094d53cb9316e9302947e1ff20c3';
export default node;
