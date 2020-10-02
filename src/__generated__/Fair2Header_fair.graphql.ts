/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Header_fair = {
    readonly about: string | null;
    readonly summary: string | null;
    readonly name: string | null;
    readonly slug: string;
    readonly profile: {
        readonly icon: {
            readonly profileUrl: string | null;
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
    readonly " $refType": "Fair2Header_fair";
};
export type Fair2Header_fair$data = Fair2Header_fair;
export type Fair2Header_fair$key = {
    readonly " $data"?: Fair2Header_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
  "args": null,
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
  "kind": "Fragment",
  "name": "Fair2Header_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "about",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
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
      "name": "slug",
      "args": null,
      "storageKey": null
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
              "alias": "profileUrl",
              "name": "url",
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "untouched-png"
                }
              ],
              "storageKey": "url(version:\"untouched-png\")"
            }
          ]
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
          "alias": "imageUrl",
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large_rectangle"
            }
          ],
          "storageKey": "url(version:\"large_rectangle\")"
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "tagline",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ticketsLink",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "fairHours",
      "name": "hours",
      "args": (v1/*: any*/),
      "storageKey": "hours(format:\"MARKDOWN\")"
    },
    {
      "kind": "ScalarField",
      "alias": "fairLinks",
      "name": "links",
      "args": (v1/*: any*/),
      "storageKey": "links(format:\"MARKDOWN\")"
    },
    {
      "kind": "ScalarField",
      "alias": "fairTickets",
      "name": "tickets",
      "args": (v1/*: any*/),
      "storageKey": "tickets(format:\"MARKDOWN\")"
    },
    {
      "kind": "ScalarField",
      "alias": "fairContact",
      "name": "contact",
      "args": (v1/*: any*/),
      "storageKey": "contact(format:\"MARKDOWN\")"
    }
  ]
};
})();
(node as any).hash = '7cfa84e2bf8328115d16933c384d5497';
export default node;
