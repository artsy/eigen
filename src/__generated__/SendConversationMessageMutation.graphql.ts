/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type SendConversationMessageMutationVariables = {
    readonly input: {
        readonly id?: string;
        readonly from?: string;
        readonly body_text?: string;
        readonly reply_to_message_id?: string;
        readonly clientMutationId: string | null;
    };
};
export type SendConversationMessageMutationResponse = {
    readonly sendConversationMessage: ({
        readonly messageEdge: ({
            readonly node: ({
                readonly impulse_id: string;
                readonly is_from_user: boolean | null;
                readonly body: string | null;
                readonly __id: string;
            }) | null;
        }) | null;
    }) | null;
};



/*
mutation SendConversationMessageMutation(
  $input: SendConversationMessageMutationInput!
) {
  sendConversationMessage(input: $input) {
    messageEdge {
      node {
        impulse_id
        is_from_user
        body
        __id
        ...Message_message
      }
    }
  }
}

fragment Message_message on Message {
  body
  created_at
  is_from_user
  from {
    name
    email
  }
  invoice {
    payment_url
    ...InvoicePreview_invoice
    __id
  }
  attachments {
    id
    content_type
    download_url
    file_name
    ...ImagePreview_attachment
    ...PDFPreview_attachment
  }
  __id
}

fragment InvoicePreview_invoice on Invoice {
  payment_url
  state
  total
  lewitt_invoice_id
  __id
}

fragment ImagePreview_attachment on Attachment {
  download_url
  ...AttachmentPreview_attachment
}

fragment PDFPreview_attachment on Attachment {
  file_name
  ...AttachmentPreview_attachment
}

fragment AttachmentPreview_attachment on Attachment {
  id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SendConversationMessageMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "SendConversationMessageMutationInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "impulse_id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_from_user",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "body",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "SendConversationMessageMutation",
  "id": null,
  "text": "mutation SendConversationMessageMutation(\n  $input: SendConversationMessageMutationInput!\n) {\n  sendConversationMessage(input: $input) {\n    messageEdge {\n      node {\n        impulse_id\n        is_from_user\n        body\n        __id\n        ...Message_message\n      }\n    }\n  }\n}\n\nfragment Message_message on Message {\n  body\n  created_at\n  is_from_user\n  from {\n    name\n    email\n  }\n  invoice {\n    payment_url\n    ...InvoicePreview_invoice\n    __id\n  }\n  attachments {\n    id\n    content_type\n    download_url\n    file_name\n    ...ImagePreview_attachment\n    ...PDFPreview_attachment\n  }\n  __id\n}\n\nfragment InvoicePreview_invoice on Invoice {\n  payment_url\n  state\n  total\n  lewitt_invoice_id\n  __id\n}\n\nfragment ImagePreview_attachment on Attachment {\n  download_url\n  ...AttachmentPreview_attachment\n}\n\nfragment PDFPreview_attachment on Attachment {\n  file_name\n  ...AttachmentPreview_attachment\n}\n\nfragment AttachmentPreview_attachment on Attachment {\n  id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SendConversationMessageMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConversationMessage",
        "storageKey": null,
        "args": v1,
        "concreteType": "SendConversationMessageMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messageEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "MessageEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Message",
                "plural": false,
                "selections": [
                  v2,
                  v3,
                  v4,
                  v5,
                  {
                    "kind": "FragmentSpread",
                    "name": "Message_message",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SendConversationMessageMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConversationMessage",
        "storageKey": null,
        "args": v1,
        "concreteType": "SendConversationMessageMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messageEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "MessageEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Message",
                "plural": false,
                "selections": [
                  v2,
                  v3,
                  v4,
                  v5,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "created_at",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "from",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageInitiator",
                    "plural": false,
                    "selections": [
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
                        "name": "email",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "invoice",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Invoice",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "payment_url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "total",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lewitt_invoice_id",
                        "args": null,
                        "storageKey": null
                      },
                      v5
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "attachments",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Attachment",
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
                        "name": "content_type",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "download_url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "file_name",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6e5ff1e232848ad66c3ad72e22ee1054';
export default node;
