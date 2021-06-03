/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0a9e6fd7f91224c79b579d7c3bd40c82 */

import { ConcreteRequest } from "relay-runtime";
export type CreateSavedSearchInput = {
    artistID?: string | null;
    attribution?: string | null;
    category?: string | null;
    clientMutationId?: string | null;
    priceMax?: number | null;
    priceMin?: number | null;
    size?: string | null;
};
export type ArtistArtworksContainerCreateSavedSearchMutationVariables = {
    input: CreateSavedSearchInput;
};
export type ArtistArtworksContainerCreateSavedSearchMutationResponse = {
    readonly createSavedSearch: {
        readonly clientMutationId: string | null;
    } | null;
};
export type ArtistArtworksContainerCreateSavedSearchMutation = {
    readonly response: ArtistArtworksContainerCreateSavedSearchMutationResponse;
    readonly variables: ArtistArtworksContainerCreateSavedSearchMutationVariables;
};



/*
mutation ArtistArtworksContainerCreateSavedSearchMutation(
  $input: CreateSavedSearchInput!
) {
  createSavedSearch(input: $input) {
    clientMutationId
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
    "concreteType": "CreateSavedSearchPayload",
    "kind": "LinkedField",
    "name": "createSavedSearch",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
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
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "0a9e6fd7f91224c79b579d7c3bd40c82",
    "metadata": {},
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '7024ad4eb3954afdbea20b02568bf2a9';
export default node;
