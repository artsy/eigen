/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 28a4a013d09646916f446618aee15cd7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalizationListQueryVariables = {};
export type OnboardingPersonalizationListQueryResponse = {
    readonly highlights: {
        readonly " $fragmentRefs": FragmentRefs<"OnboardingPersonalization_highlights">;
    } | null;
};
export type OnboardingPersonalizationListQuery = {
    readonly response: OnboardingPersonalizationListQueryResponse;
    readonly variables: OnboardingPersonalizationListQueryVariables;
};



/*
query OnboardingPersonalizationListQuery {
  highlights {
    ...OnboardingPersonalization_highlights
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment OnboardingPersonalization_highlights on Highlights {
  popularArtists(excludeFollowedArtists: true) {
    internalID
    ...ArtistListItem_artist
    id
  }
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OnboardingPersonalizationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Highlights",
        "kind": "LinkedField",
        "name": "highlights",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OnboardingPersonalization_highlights"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OnboardingPersonalizationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Highlights",
        "kind": "LinkedField",
        "name": "highlights",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "excludeFollowedArtists",
                "value": true
              }
            ],
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "popularArtists",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "initials",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "href",
                "storageKey": null
              },
              {
                "alias": "is_followed",
                "args": null,
                "kind": "ScalarField",
                "name": "isFollowed",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "nationality",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "birthday",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "deathday",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Image",
                "kind": "LinkedField",
                "name": "image",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "popularArtists(excludeFollowedArtists:true)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "28a4a013d09646916f446618aee15cd7",
    "metadata": {},
    "name": "OnboardingPersonalizationListQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '250f305d8a19c3c02b63b677504e785f';
export default node;
