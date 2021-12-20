/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV2_me = {
    readonly emailFrequency: string | null;
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "CreateSavedSearchContentContainerV2_me";
};
export type CreateSavedSearchContentContainerV2_me$data = CreateSavedSearchContentContainerV2_me;
export type CreateSavedSearchContentContainerV2_me$key = {
    readonly " $data"?: CreateSavedSearchContentContainerV2_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "criteria"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateSavedSearchContentContainerV2_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "emailFrequency",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "criteria",
          "variableName": "criteria"
        }
      ],
      "concreteType": "SearchCriteria",
      "kind": "LinkedField",
      "name": "savedSearch",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'c348cd49f594bb264f9e53f0d8caa3a0';
export default node;
