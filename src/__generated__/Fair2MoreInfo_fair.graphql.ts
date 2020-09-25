/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfo_fair = {
    readonly about: string | null;
    readonly name: string | null;
    readonly slug: string;
    readonly tagline: string | null;
    readonly profile: {
        readonly name: string | null;
    } | null;
    readonly location: {
        readonly coordinates: {
            readonly lat: number | null;
            readonly lng: number | null;
        } | null;
        readonly summary: string | null;
        readonly " $fragmentRefs": FragmentRefs<"LocationMap_location">;
    } | null;
    readonly ticketsLink: string | null;
    readonly hours: string | null;
    readonly links: string | null;
    readonly tickets: string | null;
    readonly summary: string | null;
    readonly contact: string | null;
    readonly " $refType": "Fair2MoreInfo_fair";
};
export type Fair2MoreInfo_fair$data = Fair2MoreInfo_fair;
export type Fair2MoreInfo_fair$key = {
    readonly " $data"?: Fair2MoreInfo_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2MoreInfo_fair">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
];
return {
  "kind": "Fragment",
  "name": "Fair2MoreInfo_fair",
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
      "name": "slug",
      "args": null,
      "storageKey": null
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
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ]
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
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "coordinates",
          "storageKey": null,
          "args": null,
          "concreteType": "LatLng",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lat",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lng",
              "args": null,
              "storageKey": null
            }
          ]
        },
        (v1/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        }
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
      "alias": null,
      "name": "hours",
      "args": (v2/*: any*/),
      "storageKey": "hours(format:\"MARKDOWN\")"
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "links",
      "args": (v2/*: any*/),
      "storageKey": "links(format:\"MARKDOWN\")"
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "tickets",
      "args": (v2/*: any*/),
      "storageKey": "tickets(format:\"MARKDOWN\")"
    },
    (v1/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "contact",
      "args": (v2/*: any*/),
      "storageKey": "contact(format:\"MARKDOWN\")"
    }
  ]
};
})();
(node as any).hash = 'fff28916fcb01e8d4fa3465946d0bfce';
export default node;
