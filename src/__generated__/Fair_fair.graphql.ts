/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair_fair = {
    readonly internalID: string;
    readonly slug: string;
    readonly isActive: boolean | null;
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
    readonly " $fragmentRefs": FragmentRefs<"FairHeader_fair" | "FairEmptyState_fair" | "FairEditorial_fair" | "FairCollections_fair" | "FairArtworks_fair" | "FairExhibitors_fair" | "FairFollowedArtistsRail_fair">;
    readonly " $refType": "Fair_fair";
};
export type Fair_fair$data = Fair_fair;
export type Fair_fair$key = {
    readonly " $data"?: Fair_fair$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"Fair_fair">;
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
  "name": "Fair_fair",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isActive",
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
          "value": 5
        }
      ],
      "concreteType": "MarketingCollection",
      "kind": "LinkedField",
      "name": "marketingCollections",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": "marketingCollections(size:5)"
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
          "name": "input",
          "value": {
            "includeArtworksByFollowedArtists": true
          }
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
      "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairHeader_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairEmptyState_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairEditorial_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairCollections_fair"
    },
    {
      "args": [
        {
          "kind": "Literal",
          "name": "input",
          "value": {
            "sort": "-decayed_merch"
          }
        }
      ],
      "kind": "FragmentSpread",
      "name": "FairArtworks_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairExhibitors_fair"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairFollowedArtistsRail_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = 'aa41cce0bb52aaac081841b981c5dd3d';
export default node;
