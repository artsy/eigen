/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertContent_me = {
    readonly emailFrequency: string | null;
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "CreateSavedSearchAlertContent_me";
};
export type CreateSavedSearchAlertContent_me$data = CreateSavedSearchAlertContent_me;
export type CreateSavedSearchAlertContent_me$key = {
    readonly " $data"?: CreateSavedSearchAlertContent_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchAlertContent_me">;
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
  "name": "CreateSavedSearchAlertContent_me",
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
(node as any).hash = '98f22ba77ecdf3e20a42783c60e14b63';
export default node;
