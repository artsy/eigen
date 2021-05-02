/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fbcaa571da1eb2506597810b42d97307 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalizationTestsQueryVariables = {
    excludeArtistIDs?: Array<string | null> | null;
};
export type OnboardingPersonalizationTestsQueryResponse = {
    readonly highlights: {
        readonly popularArtists: ReadonlyArray<{
            readonly internalID: string;
            readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
        } | null> | null;
    } | null;
};
export type OnboardingPersonalizationTestsQuery = {
    readonly response: OnboardingPersonalizationTestsQueryResponse;
    readonly variables: OnboardingPersonalizationTestsQueryVariables;
};



/*
query OnboardingPersonalizationTestsQuery(
  $excludeArtistIDs: [String]
) {
  highlights {
    popularArtists(excludeFollowedArtists: true, excludeArtistIDs: $excludeArtistIDs) {
      internalID
      ...ArtistListItem_artist
      id
    }
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "excludeArtistIDs"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "excludeArtistIDs",
    "variableName": "excludeArtistIDs"
  },
  {
    "kind": "Literal",
    "name": "excludeFollowedArtists",
    "value": true
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OnboardingPersonalizationTestsQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "popularArtists",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ArtistListItem_artist"
              }
            ],
            "storageKey": null
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
    "name": "OnboardingPersonalizationTestsQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "popularArtists",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
    "id": "fbcaa571da1eb2506597810b42d97307",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "highlights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Highlights"
        },
        "highlights.popularArtists": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Artist"
        },
        "highlights.popularArtists.birthday": (v3/*: any*/),
        "highlights.popularArtists.deathday": (v3/*: any*/),
        "highlights.popularArtists.href": (v3/*: any*/),
        "highlights.popularArtists.id": (v4/*: any*/),
        "highlights.popularArtists.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "highlights.popularArtists.image.url": (v3/*: any*/),
        "highlights.popularArtists.initials": (v3/*: any*/),
        "highlights.popularArtists.internalID": (v4/*: any*/),
        "highlights.popularArtists.is_followed": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "highlights.popularArtists.name": (v3/*: any*/),
        "highlights.popularArtists.nationality": (v3/*: any*/),
        "highlights.popularArtists.slug": (v4/*: any*/)
      }
    },
    "name": "OnboardingPersonalizationTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9d72c04f1b4b1f44b7c27de3b750eb8a';
export default node;
