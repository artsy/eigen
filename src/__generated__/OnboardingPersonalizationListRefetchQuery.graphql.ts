/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e25eb52fb14d14b369e7812607766fe7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalizationListRefetchQueryVariables = {
    excludeArtistIDs?: Array<string | null> | null;
};
export type OnboardingPersonalizationListRefetchQueryResponse = {
    readonly highlights: {
        readonly " $fragmentRefs": FragmentRefs<"OnboardingPersonalization_highlights">;
    } | null;
};
export type OnboardingPersonalizationListRefetchQuery = {
    readonly response: OnboardingPersonalizationListRefetchQueryResponse;
    readonly variables: OnboardingPersonalizationListRefetchQueryVariables;
};



/*
query OnboardingPersonalizationListRefetchQuery(
  $excludeArtistIDs: [String]
) {
  highlights {
    ...OnboardingPersonalization_highlights_1n4w82
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

fragment OnboardingPersonalization_highlights_1n4w82 on Highlights {
  popularArtists(excludeFollowedArtists: true, excludeArtistIDs: $excludeArtistIDs) {
    internalID
    ...ArtistListItem_artist
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "excludeArtistIDs"
  }
],
v1 = {
  "kind": "Variable",
  "name": "excludeArtistIDs",
  "variableName": "excludeArtistIDs"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OnboardingPersonalizationListRefetchQuery",
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
            "args": [
              (v1/*: any*/)
            ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "OnboardingPersonalizationListRefetchQuery",
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
              (v1/*: any*/),
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e25eb52fb14d14b369e7812607766fe7",
    "metadata": {},
    "name": "OnboardingPersonalizationListRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '381066d87c041ff3e99169c885512c4f';
export default node;
