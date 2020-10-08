/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowHeader_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly id: string;
    readonly name: string | null;
    readonly is_followed: boolean | null;
    readonly end_at: string | null;
    readonly exhibition_period: string | null;
    readonly isStubShow: boolean | null;
    readonly partner: {
        readonly name?: string | null;
        readonly slug?: string;
        readonly href?: string | null;
    } | null;
    readonly coverImage: {
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null;
    readonly images: ReadonlyArray<{
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null> | null;
    readonly followedArtists: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly artist: {
                    readonly name: string | null;
                    readonly href: string | null;
                    readonly slug: string;
                    readonly internalID: string;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
        readonly href: string | null;
        readonly slug: string;
        readonly internalID: string;
    } | null> | null;
    readonly " $refType": "ShowHeader_show";
};
export type ShowHeader_show$data = ShowHeader_show;
export type ShowHeader_show$key = {
    readonly " $data"?: ShowHeader_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowHeader_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
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
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  },
  {
    "alias": "aspect_ratio",
    "args": null,
    "kind": "ScalarField",
    "name": "aspectRatio",
    "storageKey": null
  }
],
v5 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowHeader_show",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v2/*: any*/),
    {
      "alias": "is_followed",
      "args": null,
      "kind": "ScalarField",
      "name": "isFollowed",
      "storageKey": null
    },
    {
      "alias": "end_at",
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": "exhibition_period",
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionPeriod",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isStubShow",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            (v2/*: any*/),
            (v0/*: any*/),
            (v3/*: any*/)
          ],
          "type": "Partner",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": (v4/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": (v4/*: any*/),
      "storageKey": null
    },
    {
      "alias": "followedArtists",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ShowFollowArtistConnection",
      "kind": "LinkedField",
      "name": "followedArtistsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ShowFollowArtistEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ShowFollowArtist",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artist",
                  "kind": "LinkedField",
                  "name": "artist",
                  "plural": false,
                  "selections": (v5/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "followedArtistsConnection(first:3)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = 'fd0f6f7275f3fb70bcbe35ae933fd0f9';
export default node;
