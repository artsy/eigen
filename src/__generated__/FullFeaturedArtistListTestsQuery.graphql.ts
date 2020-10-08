/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4434cff676a09730b45382a407db9ac1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FullFeaturedArtistListTestsQueryVariables = {};
export type FullFeaturedArtistListTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"FullFeaturedArtistList_collection">;
    } | null;
};
export type FullFeaturedArtistListTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly artworksConnection: ({
            readonly merchandisableArtists: ReadonlyArray<({
                readonly internalID: string;
                readonly id: string;
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
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly query: {
            readonly artistIDs: ReadonlyArray<string> | null;
            readonly id: string | null;
        };
        readonly featuredArtistExclusionIds: ReadonlyArray<string> | null;
        readonly id: string;
    }) | null;
};
export type FullFeaturedArtistListTestsQuery = {
    readonly response: FullFeaturedArtistListTestsQueryResponse;
    readonly variables: FullFeaturedArtistListTestsQueryVariables;
    readonly rawResponse: FullFeaturedArtistListTestsQueryRawResponse;
};



/*
query FullFeaturedArtistListTestsQuery {
  marketingCollection(slug: "emerging-photographers") {
    ...FullFeaturedArtistList_collection
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

fragment FullFeaturedArtistList_collection on MarketingCollection {
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
    merchandisableArtists {
      internalID
      ...ArtistListItem_artist
      id
    }
    id
  }
  query {
    artistIDs
    id
  }
  featuredArtistExclusionIds
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "emerging-photographers"
  }
],
v1 = {
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
    "name": "FullFeaturedArtistListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FullFeaturedArtistList_collection"
          }
        ],
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FullFeaturedArtistListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MERCHANDISABLE_ARTISTS"
                ]
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-decayed_merch"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "artworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "merchandisableArtists",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "internalID",
                    "storageKey": null
                  },
                  (v1/*: any*/),
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
              },
              (v1/*: any*/)
            ],
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionQuery",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artistIDs",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "featuredArtistExclusionIds",
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")"
      }
    ]
  },
  "params": {
    "id": "4434cff676a09730b45382a407db9ac1",
    "metadata": {},
    "name": "FullFeaturedArtistListTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '10a2988fe05b4ed23f13205ad2f8e18a';
export default node;
