/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Detail_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly description: string | null;
    readonly location: {
        readonly openingHours: {
            readonly schedules?: ReadonlyArray<{
                readonly days: string | null;
                readonly hours: string | null;
            } | null> | null;
            readonly text?: string | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"LocationMap_location" | "HoursCollapsible_location">;
    } | null;
    readonly artistsWithoutArtworks: ReadonlyArray<{
        readonly slug: string;
    } | null> | null;
    readonly counts: {
        readonly artworks: number | null;
        readonly artists: number | null;
    } | null;
    readonly partner: {
        readonly name?: string | null;
        readonly type?: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ShowHeader_show" | "ShowArtworksPreview_show" | "ShowArtistsPreview_show" | "Shows_show">;
    readonly " $refType": "Detail_show";
};
export type Detail_show$data = Detail_show;
export type Detail_show$key = {
    readonly " $data"?: Detail_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Detail_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Detail_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
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
          "concreteType": null,
          "kind": "LinkedField",
          "name": "openingHours",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FormattedDaySchedules",
                  "kind": "LinkedField",
                  "name": "schedules",
                  "plural": true,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "days",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "hours",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "type": "OpeningHoursArray",
              "abstractKey": null
            },
            {
              "kind": "InlineFragment",
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "text",
                  "storageKey": null
                }
              ],
              "type": "OpeningHoursText",
              "abstractKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "LocationMap_location"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "HoursCollapsible_location"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artistsWithoutArtworks",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ShowCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artworks",
          "storageKey": null
        },
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
      "concreteType": null,
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
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
              "name": "type",
              "storageKey": null
            }
          ],
          "type": "Partner",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowHeader_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowArtworksPreview_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowArtistsPreview_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Shows_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '6f7c4921be394ff4cca6a761ccbb717f';
export default node;
