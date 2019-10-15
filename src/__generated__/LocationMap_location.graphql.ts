/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _LocationMap_location$ref: unique symbol;
export type LocationMap_location$ref = typeof _LocationMap_location$ref;
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
    readonly " $refType": LocationMap_location$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "LocationMap_location",
  "type": "Location",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "name": "address",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "address_2",
      "name": "address2",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "postal_code",
      "name": "postalCode",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "summary",
      "args": null,
      "storageKey": null
    },
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
    {
      "kind": "LinkedField",
      "alias": "day_schedules",
      "name": "daySchedules",
      "storageKey": null,
      "args": null,
      "concreteType": "DaySchedule",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": "start_time",
          "name": "startTime",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "end_time",
          "name": "endTime",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "day_of_week",
          "name": "dayOfWeek",
          "args": null,
          "storageKey": null
        }
      ]
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
        },
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
        }
      ]
    }
  ]
};
(node as any).hash = 'f4911b776eb98bf925c62fde4c6bfaf8';
export default node;
