/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { LocationMap_location$ref } from "./LocationMap_location.graphql";
import { ShowArtistsPreview_show$ref } from "./ShowArtistsPreview_show.graphql";
import { ShowArtworksPreview_show$ref } from "./ShowArtworksPreview_show.graphql";
import { ShowHeader_show$ref } from "./ShowHeader_show.graphql";
import { Shows_show$ref } from "./Shows_show.graphql";
declare const _Detail_show$ref: unique symbol;
export type Detail_show$ref = typeof _Detail_show$ref;
export type Detail_show = {
    readonly id: string;
    readonly name: string | null;
    readonly description: string | null;
    readonly city: string | null;
    readonly location: ({
        readonly id: string;
        readonly address: string | null;
        readonly address_2: string | null;
        readonly city: string | null;
        readonly state: string | null;
        readonly postal_code: string | null;
        readonly displayDaySchedules: ReadonlyArray<({
            readonly days: string | null;
            readonly hours: string | null;
        }) | null> | null;
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly images: ReadonlyArray<({
        readonly id: string | null;
    }) | null> | null;
    readonly status: string | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly type?: string | null;
    }) | null;
    readonly " $fragmentRefs": ShowHeader_show$ref & ShowArtworksPreview_show$ref & ShowArtistsPreview_show$ref & Shows_show$ref;
    readonly " $refType": Detail_show$ref;
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
  "name": "city",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Detail_show",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        v0,
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
        v1,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "state",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "postal_code",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "displayDaySchedules",
          "storageKey": null,
          "args": null,
          "concreteType": "FormattedDaySchedules",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "days",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hours",
              "args": null,
              "storageKey": null
            }
          ]
        },
        v2,
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": [
        v0
      ]
    },
    v3,
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworksPreview_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtistsPreview_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Shows_show",
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
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v2,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            v3,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "type",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": [
            v3
          ]
        }
      ]
    },
    v2
  ]
};
})();
(node as any).hash = '72d152d35d7fe0b1d2063a9c6402a127';
export default node;
