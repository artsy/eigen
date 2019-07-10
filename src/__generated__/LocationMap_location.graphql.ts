/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _LocationMap_location$ref: unique symbol;
export type LocationMap_location$ref = typeof _LocationMap_location$ref;
export type LocationMap_location = {
    readonly id: string;
    readonly gravityID: string;
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
    readonly openingHours: ({
        readonly schedules?: ReadonlyArray<{
            readonly days: string | null;
            readonly hours: string | null;
        } | null> | null;
        readonly text?: string | null;
    } & ({
        readonly schedules: ReadonlyArray<{
            readonly days: string | null;
            readonly hours: string | null;
        } | null> | null;
    } | {
        readonly text: string | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
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
      "name": "gravityID",
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
      "alias": null,
      "name": "address_2",
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
(node as any).hash = '4ab899f51b80ed405fe2b1b6d362dcd3';
export default node;
