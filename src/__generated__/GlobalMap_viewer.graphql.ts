/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _GlobalMap_viewer$ref: unique symbol;
export type GlobalMap_viewer$ref = typeof _GlobalMap_viewer$ref;
export type GlobalMap_viewer = {
    readonly shows: ReadonlyArray<({
        readonly id: string;
        readonly name: string | null;
    }) | null> | null;
    readonly " $refType": GlobalMap_viewer$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "GlobalMap_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "near",
      "type": "Near",
      "defaultValue": {
        "lat": 22.3964,
        "lng": 114.1095
      }
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "shows",
      "name": "partner_shows",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "near",
          "variableName": "near",
          "type": "Near"
        }
      ],
      "concreteType": "PartnerShow",
      "plural": true,
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
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__id",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '354a0cec61fad4b19055b74297443222';
export default node;
