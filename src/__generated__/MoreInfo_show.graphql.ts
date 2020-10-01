/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MoreInfo_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly pressReleaseUrl: string | null;
    readonly openingReceptionText: string | null;
    readonly partner: {
        readonly website?: string | null;
        readonly type?: string | null;
    } | null;
    readonly press_release: string | null;
    readonly events: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ShowEventSection_event">;
    } | null> | null;
    readonly " $refType": "MoreInfo_show";
};
export type MoreInfo_show$data = MoreInfo_show;
export type MoreInfo_show$key = {
    readonly " $data"?: MoreInfo_show$data;
    readonly " $fragmentRefs": FragmentRefs<"MoreInfo_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MoreInfo_show",
  "selections": [
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pressReleaseUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "openingReceptionText",
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
              "name": "website",
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
      "alias": "press_release",
      "args": null,
      "kind": "ScalarField",
      "name": "pressRelease",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ShowEventType",
      "kind": "LinkedField",
      "name": "events",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ShowEventSection_event"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '85085e24aa4e107b81ae3e19c8567e7a';
export default node;
