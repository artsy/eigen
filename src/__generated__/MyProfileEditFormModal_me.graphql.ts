/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditFormModal_me = {
<<<<<<< HEAD
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
=======
    readonly bio: string | null;
    readonly canRequestEmailConfirmation?: boolean | undefined;
    readonly email?: string | null | undefined;
    readonly identityVerified?: boolean | null | undefined;
>>>>>>> 52000b447e (send verification email on verify press)
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly name: string | null;
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
<<<<<<< HEAD
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
=======
>>>>>>> 52000b447e (send verification email on verify press)
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
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
          "name": "canRequestEmailConfirmation",
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
          "name": "identityVerified",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "Me",
  "abstractKey": null
};
<<<<<<< HEAD
<<<<<<< HEAD
(node as any).hash = '54c50800a327082547ff9a21ca7f8686';
=======
(node as any).hash = 'be66b5b98e725095225cb36f334b8e10';
>>>>>>> 0ac07c6c97 (add profile verification methods)
=======
(node as any).hash = 'd8aed4ed40ee7805f43a917c8396c9c0';
>>>>>>> 52000b447e (send verification email on verify press)
export default node;
