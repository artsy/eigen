/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairHeader_fair$ref: unique symbol;
export type FairHeader_fair$ref = typeof _FairHeader_fair$ref;
export type FairHeader_fair = {
    readonly slug: string;
    readonly name: string | null;
    readonly formattedOpeningHours: string | null;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly exhibitionPeriod: string | null;
    readonly counts: {
        readonly artists: any | null;
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
    readonly " $refType": FairHeader_fair$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "href",
    "args": null,
    "storageKey": null
  },
  (v0/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "internalID",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "FairHeader_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "formattedOpeningHours",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
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
          "name": "artists",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "followedContent",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowedContent",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artists",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": true,
          "selections": (v2/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artistsConnection",
      "storageKey": "artistsConnection(first:3)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": (v2/*: any*/)
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "icon",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "square140"
                }
              ],
              "storageKey": "url(version:\"square140\")"
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '7313dd563d2f4aae124bdc1f4cba7ddc';
export default node;
