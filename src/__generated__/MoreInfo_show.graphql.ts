/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ShowEventSection_event$ref } from "./ShowEventSection_event.graphql";
declare const _MoreInfo_show$ref: unique symbol;
export type MoreInfo_show$ref = typeof _MoreInfo_show$ref;
export type MoreInfo_show = {
    readonly internalID: string;
    readonly gravityID: string;
    readonly exhibition_period: string | null;
    readonly pressReleaseUrl: string | null;
    readonly openingReceptionText: string | null;
    readonly partner: ({
        readonly website?: string | null;
        readonly type?: string | null;
    }) | null;
    readonly press_release: string | null;
    readonly events: ReadonlyArray<({
        readonly " $fragmentRefs": ShowEventSection_event$ref;
    }) | null> | null;
    readonly " $refType": MoreInfo_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MoreInfo_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibition_period",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "pressReleaseUrl",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "openingReceptionText",
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
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "website",
              "args": null,
              "storageKey": null
            },
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
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "press_release",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "events",
      "storageKey": null,
      "args": null,
      "concreteType": "PartnerShowEventType",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ShowEventSection_event",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = 'f42f7629f5a8030c1abdbf7570830617';
export default node;
