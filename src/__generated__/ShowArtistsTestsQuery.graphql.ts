/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 618b9cfecf0b083d52dc63f57d0c5294 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtistsTestsQueryVariables = {};
export type ShowArtistsTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"ShowArtists_show">;
    } | null;
};
export type ShowArtistsTestsQueryRawResponse = {
    readonly show: ({
        readonly internalID: string;
        readonly slug: string;
        readonly artists_grouped_by_name: ReadonlyArray<({
            readonly letter: string | null;
            readonly items: ReadonlyArray<({
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
                readonly sortable_id: string | null;
            }) | null> | null;
        }) | null> | null;
        readonly id: string;
    }) | null;
};
export type ShowArtistsTestsQuery = {
    readonly response: ShowArtistsTestsQueryResponse;
    readonly variables: ShowArtistsTestsQueryVariables;
    readonly rawResponse: ShowArtistsTestsQueryRawResponse;
};



/*
query ShowArtistsTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowArtists_show
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

fragment ShowArtists_show on Show {
  internalID
  slug
  artists_grouped_by_name: artistsGroupedByName {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id: sortableID
      href
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowArtistsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ShowArtists_show"
          }
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ShowArtistsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": "artists_grouped_by_name",
            "args": null,
            "concreteType": "ArtistGroup",
            "kind": "LinkedField",
            "name": "artistsGroupedByName",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "letter",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "items",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
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
                  },
                  {
                    "alias": "sortable_id",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "sortableID",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ]
  },
  "params": {
    "id": "618b9cfecf0b083d52dc63f57d0c5294",
    "metadata": {},
    "name": "ShowArtistsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'eb3e3768845b65968de0e3c59d7c31ff';
export default node;
