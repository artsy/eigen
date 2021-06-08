/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3842c737387a99e03f0d577d6430f91b */

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
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
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
    savedSearchOrErrors {
      __typename
      ... on SearchCriteria {
        internalID
      }
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    }
  ],
  "type": "SearchCriteria",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "createSavedSearch",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "savedSearchOrErrors",
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
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "createSavedSearch",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "savedSearchOrErrors",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
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
    "id": "3842c737387a99e03f0d577d6430f91b",
    "metadata": {},
    "name": "ArtistArtworksContainerCreateSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '7bb63934512b019e56e62d406910e6a6';
export default node;
