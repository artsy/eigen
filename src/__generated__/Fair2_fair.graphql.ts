/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2_fair = {
    readonly internalID: string;
    readonly slug: string;
    readonly articles: {
        readonly edges: ReadonlyArray<{
            readonly __typename: string;
        } | null> | null;
    } | null;
    readonly marketingCollections: ReadonlyArray<{
        readonly __typename: string;
    } | null>;
    readonly counts: {
        readonly artworks: number | null;
        readonly partnerShows: number | null;
    } | null;
    readonly followedArtistArtworks: {
        readonly edges: ReadonlyArray<{
            readonly __typename: string;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair" | "Fair2Editorial_fair" | "Fair2Collections_fair" | "Fair2Artworks_fair" | "Fair2Exhibitors_fair" | "Fair2FollowedArtists_fair">;
    readonly " $refType": "Fair2_fair";
};
export type Fair2_fair$data = Fair2_fair;
export type Fair2_fair$key = {
    readonly " $data"?: Fair2_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "__typename",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "Fair2_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "articles",
      "name": "articlesConnection",
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "PUBLISHED_AT_DESC"
        }
      ],
      "concreteType": "ArticleConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArticleEdge",
          "plural": true,
          "selections": (v0/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "marketingCollections",
      "storageKey": "marketingCollections(size:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 4
        }
      ],
      "concreteType": "MarketingCollection",
      "plural": true,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "FairCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "partnerShows",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "followedArtistArtworks",
      "name": "filterArtworksConnection",
      "storageKey": "filterArtworksConnection(first:20,includeArtworksByFollowedArtists:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        },
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "plural": true,
          "selections": (v0/*: any*/)
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Header_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Editorial_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Collections_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Artworks_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Exhibitors_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2FollowedArtists_fair",
      "args": null
    }
  ]
};
})();
(node as any).hash = '30fc186373d808a8ba5181c7f91b8f04';
export default node;
