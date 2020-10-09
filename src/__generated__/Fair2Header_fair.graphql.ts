/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Header_fair = {
    readonly about: string | null;
    readonly summary: string | null;
    readonly name: string | null;
    readonly slug: string;
    readonly profile: {
        readonly icon: {
            readonly imageUrl: string | null;
        } | null;
    } | null;
    readonly image: {
        readonly imageUrl: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly tagline: string | null;
    readonly location: {
        readonly summary: string | null;
    } | null;
    readonly ticketsLink: string | null;
    readonly fairHours: string | null;
    readonly fairLinks: string | null;
    readonly fairTickets: string | null;
    readonly fairContact: string | null;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Timing_fair">;
    readonly " $refType": "Fair2Header_fair";
};
export type Fair2Header_fair$data = Fair2Header_fair;
export type Fair2Header_fair$key = {
    readonly " $data"?: Fair2Header_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2Header_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "about",
      "storageKey": null
    },
    (v0/*: any*/),
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
      "name": "slug",
      "storageKey": null
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
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "icon",
          "plural": false,
          "selections": [
            {
              "alias": "imageUrl",
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "untouched-png"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"untouched-png\")"
            }
          ],
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
          "alias": "imageUrl",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large_rectangle"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"large_rectangle\")"
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "aspectRatio",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tagline",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "ticketsLink",
      "storageKey": null
    },
    {
      "alias": "fairHours",
      "args": (v1/*: any*/),
      "kind": "ScalarField",
      "name": "hours",
      "storageKey": "hours(format:\"MARKDOWN\")"
    },
    {
      "alias": "fairLinks",
      "args": (v1/*: any*/),
      "kind": "ScalarField",
      "name": "links",
      "storageKey": "links(format:\"MARKDOWN\")"
    },
    {
      "alias": "fairTickets",
      "args": (v1/*: any*/),
      "kind": "ScalarField",
      "name": "tickets",
      "storageKey": "tickets(format:\"MARKDOWN\")"
    },
    {
      "alias": "fairContact",
      "args": (v1/*: any*/),
      "kind": "ScalarField",
      "name": "contact",
      "storageKey": "contact(format:\"MARKDOWN\")"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Fair2Timing_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = '7f2cde4276d88cbd8a72bcc1847befbf';
export default node;
