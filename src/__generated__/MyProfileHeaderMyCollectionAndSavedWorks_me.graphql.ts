/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileHeaderMyCollectionAndSavedWorks_me = {
    readonly name: string | null;
    readonly bio: string | null;
    readonly location: {
        readonly display: string | null;
    } | null;
    readonly otherRelevantPositions: string | null;
    readonly profession: string | null;
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly createdAt: string | null;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
    readonly " $refType": "MyProfileHeaderMyCollectionAndSavedWorks_me";
};
export type MyProfileHeaderMyCollectionAndSavedWorks_me$data = MyProfileHeaderMyCollectionAndSavedWorks_me;
export type MyProfileHeaderMyCollectionAndSavedWorks_me$key = {
    readonly " $data"?: MyProfileHeaderMyCollectionAndSavedWorks_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileHeaderMyCollectionAndSavedWorks_me">;
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
  "name": "MyProfileHeaderMyCollectionAndSavedWorks_me",
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
        }
      ],
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
      "name": "profession",
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
      "name": "createdAt",
      "storageKey": null
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "enableCollectorProfile",
          "variableName": "enableCollectorProfile"
        }
      ],
      "kind": "FragmentSpread",
      "name": "MyProfileEditFormModal_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '48a2533cdd07fe3fe50e3cb395a58f39';
export default node;
