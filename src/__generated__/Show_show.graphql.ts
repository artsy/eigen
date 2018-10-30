/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Artworks_show$ref } from "./Artworks_show.graphql";
import { ShowHeader_show$ref } from "./ShowHeader_show.graphql";
declare const _Show_show$ref: unique symbol;
export type Show_show$ref = typeof _Show_show$ref;
export type Show_show = {
    readonly id: string;
    readonly location: ({
        readonly __id: string;
        readonly id: string;
        readonly city: string | null;
        readonly address: string | null;
        readonly address_2: string | null;
        readonly coordinates: ({
            readonly lat: number | null;
            readonly lng: number | null;
        }) | null;
        readonly day_schedules: ReadonlyArray<({
            readonly start_time: number | null;
            readonly end_time: number | null;
            readonly day_of_week: string | null;
        }) | null> | null;
    }) | null;
    readonly artists: ReadonlyArray<({
        readonly __id: string;
        readonly id: string;
        readonly name: string | null;
        readonly is_followed: boolean | null;
    }) | null> | null;
    readonly status: string | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly eligible_artworks: any | null;
    }) | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly " $fragmentRefs": ShowHeader_show$ref & Artworks_show$ref;
    readonly " $refType": Show_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = [
  v2
];
return {
  "kind": "Fragment",
  "name": "Show_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ShowHeader_show",
      "args": null
    },
    v0,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        v1,
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "city",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "address",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "address_2",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "coordinates",
          "storageKey": null,
          "args": null,
          "concreteType": "coordinates",
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
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "day_schedules",
          "storageKey": null,
          "args": null,
          "concreteType": "DaySchedule",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "start_time",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "end_time",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "day_of_week",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        v1,
        v0,
        v2,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_followed",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Artworks_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
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
          "name": "eligible_artworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v1,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": v3
        },
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": v3
        }
      ]
    },
    v1
  ]
};
})();
(node as any).hash = '35c6537d4bc579f5732e846891b81a87';
export default node;
