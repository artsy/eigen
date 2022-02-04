/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditFormModal_me = {
    readonly name: string | null;
    readonly profession?: string | null | undefined;
    readonly otherRelevantPositions?: string | null | undefined;
    readonly location?: {
        readonly display: string | null;
        readonly city: string | null;
        readonly state: string | null;
        readonly country: string | null;
    } | null | undefined;
    readonly email?: string | null | undefined;
    readonly emailConfirmed?: boolean | undefined;
    readonly identityVerified?: boolean | null | undefined;
    readonly canRequestEmailConfirmation?: boolean | undefined;
    readonly bio: string | null;
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "MyProfileEditFormModal_me";
};
export type MyProfileEditFormModal_me$data = MyProfileEditFormModal_me;
export type MyProfileEditFormModal_me$key = {
    readonly " $data"?: MyProfileEditFormModal_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "enableCollectorProfile"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfileEditFormModal_me",
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
      "name": "bio",
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
    },
    {
      "condition": "enableCollectorProfile",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
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
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "emailConfirmed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "identityVerified",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "canRequestEmailConfirmation",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'bd1d79e60001c825793c534d6b1f306b';
export default node;
