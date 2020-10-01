/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairHeader_fair = {
    readonly slug: string;
    readonly name: string | null;
    readonly formattedOpeningHours: string | null;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly exhibitionPeriod: string | null;
    readonly counts: {
        readonly artists: number | null;
    } | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly followedContent: {
        readonly artists: ReadonlyArray<{
            readonly name: string | null;
            readonly href: string | null;
            readonly slug: string;
            readonly internalID: string;
        } | null> | null;
    } | null;
    readonly artistsConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly name: string | null;
                readonly href: string | null;
                readonly slug: string;
                readonly internalID: string;
            } | null;
        } | null> | null;
    } | null;
    readonly profile: {
        readonly id: string;
        readonly icon: {
            readonly url: string | null;
        } | null;
    } | null;
    readonly " $refType": "FairHeader_fair";
};
export type FairHeader_fair$data = FairHeader_fair;
export type FairHeader_fair$key = {
    readonly " $data"?: FairHeader_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairHeader_fair">;
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
  "name": "name",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "href",
    "storageKey": null
  },
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "internalID",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairHeader_fair",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formattedOpeningHours",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionPeriod",
      "storageKey": null
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
          "name": "artists",
          "storageKey": null
        }
      ],
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
      "alias": null,
      "args": null,
      "concreteType": "FollowedContent",
      "kind": "LinkedField",
      "name": "followedContent",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Artist",
          "kind": "LinkedField",
          "name": "artists",
          "plural": true,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ArtistConnection",
      "kind": "LinkedField",
      "name": "artistsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtistEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artist",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": (v2/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "artistsConnection(first:3)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
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
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "icon",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "square140"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"square140\")"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = '7313dd563d2f4aae124bdc1f4cba7ddc';
export default node;
