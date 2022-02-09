/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditForm_me = {
    readonly name: string | null;
    readonly profession: string | null;
    readonly otherRelevantPositions: string | null;
    readonly bio: string | null;
    readonly location: {
        readonly display: string | null;
        readonly city: string | null;
        readonly state: string | null;
        readonly country: string | null;
    } | null;
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "MyProfileEditForm_me";
};
export type MyProfileEditForm_me$data = MyProfileEditForm_me;
export type MyProfileEditForm_me$key = {
    readonly " $data"?: MyProfileEditForm_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditForm_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfileEditForm_me",
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
      "name": "profession",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "otherRelevantPositions",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MyLocation",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "display",
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
          "name": "state",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "country",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "icon",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "thumbnail"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"thumbnail\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '6f891c80b41550c0f7fa9f0ee1c78547';
export default node;
