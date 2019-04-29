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
    readonly internalID: string;
    readonly gravityID: string;
    readonly name: string | null;
    readonly description: string | null;
    readonly city: string | null;
    readonly is_local_discovery: boolean | null;
    readonly images: ReadonlyArray<({
        readonly gravityID: string | null;
    }) | null> | null;
    readonly location: ({
        readonly openingHours: ({
            readonly schedules?: ReadonlyArray<({
                readonly days: string | null;
                readonly hours: string | null;
            }) | null> | null;
            readonly text?: string | null;
        }) | null;
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly artists_without_artworks: ReadonlyArray<({
        readonly gravityID: string;
    }) | null> | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly artists: number | null;
    }) | null;
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
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
      "name": "ShowArtworksPreview_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
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
      "name": "is_local_discovery",
      "args": null,
      "storageKey": null
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
        v1
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowHeader_show",
      "args": null
    },
    v1,
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
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "openingHours",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "type": "OpeningHoursText",
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "text",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "InlineFragment",
              "type": "OpeningHoursArray",
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "schedules",
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
                }
              ]
            }
          ]
        },
        v2
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists_without_artworks",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        v1,
        v2
      ]
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
          "name": "artists",
          "args": null,
          "storageKey": null
        }
      ]
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
            v0,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "type",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    v2
  ]
};
})();
(node as any).hash = 'b9e9d8ee02a1e95f4179b17f4626e780';
export default node;
