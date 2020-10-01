/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LocationMap_location = {
    readonly id: string;
    readonly internalID: string;
    readonly city: string | null;
    readonly address: string | null;
    readonly address_2: string | null;
    readonly postal_code: string | null;
    readonly summary: string | null;
    readonly coordinates: {
        readonly lat: number | null;
        readonly lng: number | null;
    } | null;
    readonly day_schedules: ReadonlyArray<{
        readonly start_time: number | null;
        readonly end_time: number | null;
        readonly day_of_week: string | null;
    } | null> | null;
    readonly openingHours: {
        readonly schedules?: ReadonlyArray<{
            readonly days: string | null;
            readonly hours: string | null;
        } | null> | null;
        readonly text?: string | null;
    } | null;
    readonly " $refType": "LocationMap_location";
};
export type LocationMap_location$data = LocationMap_location;
export type LocationMap_location$key = {
    readonly " $data"?: LocationMap_location$data;
    readonly " $fragmentRefs": FragmentRefs<"LocationMap_location">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationMap_location",
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
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "city",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": "address_2",
      "args": null,
      "kind": "ScalarField",
      "name": "address2",
      "storageKey": null
    },
    {
      "alias": "postal_code",
      "args": null,
      "kind": "ScalarField",
      "name": "postalCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "summary",
      "storageKey": null
    },
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
    {
      "alias": "day_schedules",
      "args": null,
      "concreteType": "DaySchedule",
      "kind": "LinkedField",
      "name": "daySchedules",
      "plural": true,
      "selections": [
        {
          "alias": "start_time",
          "args": null,
          "kind": "ScalarField",
          "name": "startTime",
          "storageKey": null
        },
        {
          "alias": "end_time",
          "args": null,
          "kind": "ScalarField",
          "name": "endTime",
          "storageKey": null
        },
        {
          "alias": "day_of_week",
          "args": null,
          "kind": "ScalarField",
          "name": "dayOfWeek",
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
    }
  ],
  "type": "Location",
  "abstractKey": null
};
(node as any).hash = 'f4911b776eb98bf925c62fde4c6bfaf8';
export default node;
