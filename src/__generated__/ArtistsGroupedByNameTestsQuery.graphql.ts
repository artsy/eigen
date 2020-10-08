/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ba1091e35407c87ac76b2bfecb788de7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistsGroupedByNameTestsQueryVariables = {};
export type ArtistsGroupedByNameTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    } | null;
};
export type ArtistsGroupedByNameTestsQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly name: string | null;
        readonly initials: string | null;
        readonly href: string | null;
        readonly is_followed: boolean | null;
        readonly nationality: string | null;
        readonly birthday: string | null;
        readonly deathday: string | null;
        readonly image: ({
            readonly url: string | null;
        }) | null;
    }) | null;
};
export type ArtistsGroupedByNameTestsQuery = {
    readonly response: ArtistsGroupedByNameTestsQueryResponse;
    readonly variables: ArtistsGroupedByNameTestsQueryVariables;
    readonly rawResponse: ArtistsGroupedByNameTestsQueryRawResponse;
};



/*
query ArtistsGroupedByNameTestsQuery {
  artist(id: "pablo-picasso") {
    ...ArtistListItem_artist
    id
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
    "kind": "Literal",
    "name": "id",
    "value": "pablo-picasso"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistsGroupedByNameTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistListItem_artist"
          }
        ],
        "storageKey": "artist(id:\"pablo-picasso\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistsGroupedByNameTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
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
            "name": "internalID",
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
        "storageKey": "artist(id:\"pablo-picasso\")"
      }
    ]
  },
  "params": {
    "id": "ba1091e35407c87ac76b2bfecb788de7",
    "metadata": {},
    "name": "ArtistsGroupedByNameTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '18d107a4b9ff251ba323baf038a7277c';
export default node;
