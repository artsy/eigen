/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair" | "Fair2Editorial_fair" | "Fair2Collections_fair" | "Fair2Artworks_fair" | "Fair2Exhibitors_fair" | "Fair2FollowedArtistsRail_fair">;
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
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2_fair",
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": "articles",
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
      "kind": "LinkedField",
      "name": "articlesConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArticleEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 4
        }
      ],
      "concreteType": "MarketingCollection",
      "kind": "LinkedField",
      "name": "marketingCollections",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": "marketingCollections(size:4)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FairCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artworks",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "partnerShows",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "followedArtistArtworks",
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
      "kind": "LinkedField",
      "name": "filterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": "filterArtworksConnection(first:20,includeArtworksByFollowedArtists:true)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Header_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Editorial_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Collections_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Artworks_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Exhibitors_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2FollowedArtistsRail_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = '9f0771d3a0ecc15cad84f916e1b24058';
export default node;
