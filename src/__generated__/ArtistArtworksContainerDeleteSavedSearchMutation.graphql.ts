/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cfac0c7e54c2601783e10bca99bb8db7 */

import { ConcreteRequest } from "relay-runtime";
export type DeleteSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
};
export type ArtistArtworksContainerDeleteSavedSearchMutationVariables = {
    input: DeleteSavedSearchInput;
};
export type ArtistArtworksContainerDeleteSavedSearchMutationResponse = {
    readonly deleteSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type ArtistArtworksContainerDeleteSavedSearchMutation = {
    readonly response: ArtistArtworksContainerDeleteSavedSearchMutationResponse;
    readonly variables: ArtistArtworksContainerDeleteSavedSearchMutationVariables;
};



/*
mutation ArtistArtworksContainerDeleteSavedSearchMutation(
  $input: DeleteSavedSearchInput!
) {
  deleteSavedSearch(input: $input) {
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
    "name": "ArtistArtworksContainerDeleteSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteSavedSearchPayload",
        "kind": "LinkedField",
        "name": "deleteSavedSearch",
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
    "name": "ArtistArtworksContainerDeleteSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteSavedSearchPayload",
        "kind": "LinkedField",
        "name": "deleteSavedSearch",
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
    "id": "cfac0c7e54c2601783e10bca99bb8db7",
    "metadata": {},
    "name": "ArtistArtworksContainerDeleteSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '38ab97f0f41ace38f49bfc35cc3d0973';
export default node;
