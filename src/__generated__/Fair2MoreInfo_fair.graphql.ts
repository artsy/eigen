/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfo_fair = {
    readonly about: string | null;
    readonly name: string | null;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2MoreInfo_fair",
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
      "name": "tagline",
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
        (v0/*: any*/)
      ],
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
        {
          "alias": null,
          "args": null,
          "concreteType": "LatLng",
          "kind": "LinkedField",
          "name": "coordinates",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "lat",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "lng",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "LocationMap_location"
        }
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
      "alias": null,
      "args": (v2/*: any*/),
      "kind": "ScalarField",
      "name": "hours",
      "storageKey": "hours(format:\"MARKDOWN\")"
    },
    {
      "alias": null,
      "args": (v2/*: any*/),
      "kind": "ScalarField",
      "name": "links",
      "storageKey": "links(format:\"MARKDOWN\")"
    },
    {
      "alias": null,
      "args": (v2/*: any*/),
      "kind": "ScalarField",
      "name": "tickets",
      "storageKey": "tickets(format:\"MARKDOWN\")"
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": (v2/*: any*/),
      "kind": "ScalarField",
      "name": "contact",
      "storageKey": "contact(format:\"MARKDOWN\")"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
})();
(node as any).hash = 'e97c82f264b236875fa1acdf28507f9f';
export default node;
