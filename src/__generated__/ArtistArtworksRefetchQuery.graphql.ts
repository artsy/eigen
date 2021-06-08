/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a26c5ad4ee9b5cc35f64833286d5e674 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null;
    additionalGeneIDs?: Array<string> | null;
    artistID?: string | null;
    atAuction?: boolean | null;
    attributionClasses?: Array<string> | null;
    colors?: Array<string> | null;
    heightMax?: number | null;
    heightMin?: number | null;
    inquireableOnly?: boolean | null;
    locationCities?: Array<string> | null;
    majorPeriods?: Array<string> | null;
    materialsTerms?: Array<string> | null;
    offerable?: boolean | null;
    partnerIDs?: Array<string> | null;
    priceMax?: number | null;
    priceMin?: number | null;
    size?: string | null;
    widthMax?: number | null;
    widthMin?: number | null;
};
export type ArtistArtworksRefetchQueryVariables = {
    criteria?: SearchCriteriaAttributes | null;
};
export type ArtistArtworksRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistArtworks_me">;
    } | null;
};
export type ArtistArtworksRefetchQuery = {
    readonly response: ArtistArtworksRefetchQueryResponse;
    readonly variables: ArtistArtworksRefetchQueryVariables;
};



/*
query ArtistArtworksRefetchQuery(
  $criteria: SearchCriteriaAttributes
) {
  me {
    ...ArtistArtworks_me_1ff8oJ
    id
  }
}

fragment ArtistArtworks_me_1ff8oJ on Me {
  name
  savedSearch(criteria: $criteria) {
    internalID
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "criteria"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "criteria",
    "variableName": "criteria"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArtworksRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": (v1/*: any*/),
            "kind": "FragmentSpread",
            "name": "ArtistArtworks_me"
          }
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
    "name": "ArtistArtworksRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "SearchCriteria",
            "kind": "LinkedField",
            "name": "savedSearch",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
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
    "id": "a26c5ad4ee9b5cc35f64833286d5e674",
    "metadata": {},
    "name": "ArtistArtworksRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '71438327a65d4a726d83b9ed738caa54';
export default node;
