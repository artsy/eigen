/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedArtistsTestsQueryVariables = {};
export type FeaturedArtistsTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"FeaturedArtists_collection">;
    } | null;
};
export type FeaturedArtistsTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly artworksConnection: ({
            readonly merchandisableArtists: ReadonlyArray<({
                readonly slug: string;
                readonly internalID: string;
                readonly name: string | null;
                readonly imageUrl: string | null;
                readonly birthday: string | null;
                readonly nationality: string | null;
                readonly isFollowed: boolean | null;
                readonly id: string | null;
            }) | null> | null;
            readonly id: string | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type FeaturedArtistsTestsQuery = {
    readonly response: FeaturedArtistsTestsQueryResponse;
    readonly variables: FeaturedArtistsTestsQueryVariables;
    readonly rawResponse: FeaturedArtistsTestsQueryRawResponse;
};



/*
query FeaturedArtistsTestsQuery {
  marketingCollection(slug: "emerging-photographers") {
    ...FeaturedArtists_collection
    id
  }
}

fragment FeaturedArtists_collection on MarketingCollection {
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 9, sort: "-decayed_merch") {
    merchandisableArtists {
      slug
      internalID
      name
      imageUrl
      birthday
      nationality
      isFollowed
      id
    }
    id
  }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeaturedArtistsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FeaturedArtists_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeaturedArtistsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworksConnection",
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:9,sort:\"-decayed_merch\")",
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
                "value": 9
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-decayed_merch"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "merchandisableArtists",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slug",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "name",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "imageUrl",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "birthday",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "nationality",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeaturedArtistsTestsQuery",
    "id": "e5db888b6d9f87e17511922162c7da7e",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b052d942acd32e0160c794935f46ac33';
export default node;
