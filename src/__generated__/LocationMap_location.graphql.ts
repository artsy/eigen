/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _LocationMap_location$ref: unique symbol;
export type LocationMap_location$ref = typeof _LocationMap_location$ref;
export type LocationMap_location = {
    readonly __id: string;
    readonly id: string;
    readonly city: string | null;
    readonly address: string | null;
    readonly address_2: string | null;
    readonly display: string | null;
    readonly coordinates: ({
        readonly lat: number | null;
        readonly lng: number | null;
    }) | null;
    readonly day_schedules: ReadonlyArray<({
        readonly start_time: number | null;
        readonly end_time: number | null;
        readonly day_of_week: string | null;
    }) | null> | null;
    readonly " $refType": LocationMap_location$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "LocationMap_location",
  "type": "Location",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
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
      "name": "display",
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
    }
  ]
};
(node as any).hash = 'a161cca569b8e150f7c7f5134c4d1175';
export default node;
