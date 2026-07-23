/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const snapshot = [
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location:</p>\n<p><em>{ALERT_INFO}</em></p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>If this was you, you may disregard this email.</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "",
      "authToken": {
        "duration": 1209600
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": "",
      "deleteRule": "id = @request.auth.id",
      "emailChangeToken": {
        "duration": 1800
      },
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 10,
          "help": "",
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9_]{50}",
          "help": "",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "help": "",
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": false,
          "system": true,
          "type": "email"
        },
        {
          "help": "",
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "autogeneratePattern": "users[0-9]{6}",
          "help": "",
          "hidden": false,
          "id": "text4166911607",
          "max": 150,
          "min": 3,
          "name": "username",
          "pattern": "^[\\w][\\w\\.\\-]*$",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "users_name",
          "max": 0,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "users_avatar",
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "name": "avatar",
          "presentable": false,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": null,
          "type": "file"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "fileToken": {
        "duration": 120
      },
      "id": "_pb_users_auth_",
      "indexes": [
        "CREATE UNIQUE INDEX `__pb_users_auth__username_idx` ON `users` (username COLLATE NOCASE)",
        "CREATE UNIQUE INDEX `__pb_users_auth__email_idx` ON `users` (`email`) WHERE `email` != ''",
        "CREATE UNIQUE INDEX `__pb_users_auth__tokenKey_idx` ON `users` (`tokenKey`)"
      ],
      "listRule": "id = @request.auth.id",
      "manageRule": null,
      "mfa": {
        "duration": 600,
        "enabled": false,
        "rule": ""
      },
      "name": "users",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "",
          "id": "",
          "name": "",
          "username": "username"
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email",
          "username"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": false,
      "type": "auth",
      "updateRule": "id = @request.auth.id",
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 604800
      },
      "viewRule": "id = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "rmyvz3nd",
          "max": 200,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "_pb_users_auth_",
          "help": "",
          "hidden": false,
          "id": "sqbvop7z",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "owner",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "v2xydm0p",
          "max": 3,
          "min": 3,
          "name": "default_currency",
          "pattern": "^[A-Z]{3}$",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "kqbuh8uh",
          "maxSize": 2000000,
          "name": "tax_profile_json",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "help": "",
          "hidden": false,
          "id": "yazcmtja",
          "max": 60,
          "min": 0,
          "name": "billing_rounding_minutes",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "exceptDomains": null,
          "help": "",
          "hidden": false,
          "id": "1ol54qkp",
          "name": "invoice_from_email",
          "onlyDomains": null,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "email"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "slshxfdo",
          "max": 200,
          "min": 0,
          "name": "invoice_from_name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "workspaces_____",
      "indexes": [
        "CREATE INDEX idx_workspaces_owner ON workspaces (owner)"
      ],
      "listRule": "@request.auth.id != \"\" && owner = @request.auth.id",
      "name": "workspaces",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "2laoilx2",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "_pb_users_auth_",
          "help": "",
          "hidden": false,
          "id": "fuubvisb",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "user",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "8tqrzudd",
          "maxSelect": 1,
          "name": "role",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "owner",
            "admin",
            "member"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "workspace_membe_",
      "indexes": [
        "CREATE UNIQUE INDEX idx_workspace_members_unique ON workspace_members (workspace, user)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "workspace_members",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "v2xvi4ki",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "zi77sili",
          "max": 200,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "help": "",
          "hidden": false,
          "id": "awa3wgss",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "email"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "hfmlj3ou",
          "max": 1000,
          "min": 0,
          "name": "address",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ngxy7udx",
          "max": null,
          "min": 0,
          "name": "default_rate_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "id8wwcvj",
          "max": 5000,
          "min": 0,
          "name": "notes",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "csebnzfq",
          "name": "archived",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "clients________",
      "indexes": [
        "CREATE INDEX idx_clients_workspace ON clients (workspace)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "clients",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "fhosv4kw",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "gwiadqnw",
          "max": 200,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "no0ccg62",
          "max": null,
          "min": 0,
          "name": "rate_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ujwcqy4k",
          "name": "billable_default",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "tasks__________",
      "indexes": [
        "CREATE INDEX idx_tasks_workspace ON tasks (workspace)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "tasks",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "qvr63jdb",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "clients________",
          "help": "",
          "hidden": false,
          "id": "z8bmqowd",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "client",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "lirrbvao",
          "max": 200,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "4bof5uov",
          "max": null,
          "min": 0,
          "name": "rate_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "oor97lvd",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "paused",
            "archived"
          ]
        },
        {
          "help": "",
          "hidden": false,
          "id": "8uao0trr",
          "max": null,
          "min": 0,
          "name": "budget_hours",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "hftyqkqb",
          "max": 20,
          "min": 0,
          "name": "color",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "projects_______",
      "indexes": [
        "CREATE INDEX idx_projects_workspace ON projects (workspace)",
        "CREATE INDEX idx_projects_client ON projects (client)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "projects",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "r6giwsou",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "projects_______",
          "help": "",
          "hidden": false,
          "id": "xi5j3zyk",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "project",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "tasks__________",
          "help": "",
          "hidden": false,
          "id": "s8kpanos",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "task",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ypbpvtmx",
          "max": "",
          "min": "",
          "name": "started_at",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "3yydf3fa",
          "max": "",
          "min": "",
          "name": "ended_at",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "owzwjc33",
          "max": 5000,
          "min": 0,
          "name": "description",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "kt0gyqmm",
          "name": "billable",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "fzwdpkgp",
          "max": null,
          "min": 0,
          "name": "rate_cents_snapshot",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "cascadeDelete": false,
          "collectionId": "invoices_______",
          "help": "",
          "hidden": false,
          "id": "q4rrteei",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "invoice",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "time_entries___",
      "indexes": [
        "CREATE INDEX idx_time_entries_workspace ON time_entries (workspace)",
        "CREATE INDEX idx_time_entries_project ON time_entries (project)",
        "CREATE INDEX idx_time_entries_started_at ON time_entries (started_at)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "time_entries",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "fgrbkgyk",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "uv9crkxp",
          "max": 200,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "fwu3fgdb",
          "max": 100,
          "min": 0,
          "name": "schedule_c_line",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "expense_cats___",
      "indexes": [
        "CREATE INDEX idx_expense_cats_workspace ON expense_categories (workspace)",
        "CREATE UNIQUE INDEX idx_expense_cats_unique ON expense_categories (workspace, name)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "expense_categories",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "fvlkngek",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "expense_cats___",
          "help": "",
          "hidden": false,
          "id": "ijqgqhlq",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "category",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "nem16u1h",
          "max": "",
          "min": "",
          "name": "date",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "7flxk82b",
          "max": null,
          "min": null,
          "name": "amount_cents",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "m5ya3ed5",
          "max": 200,
          "min": 0,
          "name": "vendor",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "g0gatymn",
          "max": 5000,
          "min": 0,
          "name": "description",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "clients________",
          "help": "",
          "hidden": false,
          "id": "6xzokjs7",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "client",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "projects_______",
          "help": "",
          "hidden": false,
          "id": "odqkypec",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "project",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "rq8hmdph",
          "name": "billable",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "jncbtjp8",
          "name": "reimbursable",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "paf77uwe",
          "maxSelect": 1,
          "maxSize": 10485760,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/heic",
            "application/pdf"
          ],
          "name": "receipt",
          "presentable": false,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": [
            "200x200"
          ],
          "type": "file"
        },
        {
          "cascadeDelete": false,
          "collectionId": "invoices_______",
          "help": "",
          "hidden": false,
          "id": "ydtajqfc",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "invoice",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "expenses_______",
      "indexes": [
        "CREATE INDEX idx_expenses_workspace ON expenses (workspace)",
        "CREATE INDEX idx_expenses_date ON expenses (date)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "expenses",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "ctkra0a6",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "nmr9bmyv",
          "max": "",
          "min": "",
          "name": "date",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "nfv6o454",
          "max": null,
          "min": 0,
          "name": "miles",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "ltw4utla",
          "max": 500,
          "min": 0,
          "name": "purpose",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "clients________",
          "help": "",
          "hidden": false,
          "id": "b4whdvb0",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "client",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "projects_______",
          "help": "",
          "hidden": false,
          "id": "tjdmy7mi",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "project",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "gfzc6cx3",
          "name": "billable",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "weajgd3l",
          "max": null,
          "min": 0,
          "name": "rate_cents_snapshot",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "cascadeDelete": false,
          "collectionId": "invoices_______",
          "help": "",
          "hidden": false,
          "id": "yhltmhv3",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "invoice",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "mileage________",
      "indexes": [
        "CREATE INDEX idx_mileage_workspace ON mileage_entries (workspace)",
        "CREATE INDEX idx_mileage_date ON mileage_entries (date)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "mileage_entries",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "ymujvguo",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "expense_cats___",
          "help": "",
          "hidden": false,
          "id": "6fnpnrkl",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "category",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "pf5szhvd",
          "max": null,
          "min": 0,
          "name": "amount_cents",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "gvyfmrjk",
          "max": 200,
          "min": 0,
          "name": "vendor",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "wb0gxxr4",
          "maxSelect": 1,
          "name": "cadence",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "weekly",
            "monthly",
            "yearly"
          ]
        },
        {
          "help": "",
          "hidden": false,
          "id": "iuamszvw",
          "max": "",
          "min": "",
          "name": "next_run",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "kgoklubn",
          "name": "active",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "recurring_exp__",
      "indexes": [
        "CREATE INDEX idx_recurring_exp_workspace ON recurring_expenses (workspace)",
        "CREATE INDEX idx_recurring_exp_next_run ON recurring_expenses (next_run)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "recurring_expenses",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "tdehg3el",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "clients________",
          "help": "",
          "hidden": false,
          "id": "0po636qj",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "client",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "xurrlnh7",
          "max": 50,
          "min": 0,
          "name": "number",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "emgocos8",
          "max": "",
          "min": "",
          "name": "issue_date",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "6eu2e7a6",
          "max": "",
          "min": "",
          "name": "due_date",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "kqwcxocv",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "draft",
            "sent",
            "viewed",
            "paid",
            "overdue",
            "void"
          ]
        },
        {
          "help": "",
          "hidden": false,
          "id": "urcnhkdy",
          "max": null,
          "min": 0,
          "name": "subtotal_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "pem1tzwm",
          "max": null,
          "min": 0,
          "name": "tax_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "pgkb6bzo",
          "max": null,
          "min": 0,
          "name": "total_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "q2rvo4oh",
          "max": 5000,
          "min": 0,
          "name": "notes",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "mrur5o5m",
          "max": 100,
          "min": 16,
          "name": "public_token",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "frpuvgyl",
          "maxSelect": 1,
          "maxSize": 10485760,
          "mimeTypes": [
            "application/pdf"
          ],
          "name": "pdf",
          "presentable": false,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": null,
          "type": "file"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "invoices_______",
      "indexes": [
        "CREATE INDEX idx_invoices_workspace ON invoices (workspace)",
        "CREATE INDEX idx_invoices_client ON invoices (client)",
        "CREATE UNIQUE INDEX idx_invoices_number ON invoices (workspace, number)",
        "CREATE UNIQUE INDEX idx_invoices_public_token ON invoices (public_token)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "invoices",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && invoice.workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && invoice.workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "invoices_______",
          "help": "",
          "hidden": false,
          "id": "tvcygvbg",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "invoice",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "f7ni2lm4",
          "max": 1000,
          "min": 0,
          "name": "description",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "0sgmhwll",
          "max": null,
          "min": null,
          "name": "quantity",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ngx5yvda",
          "max": null,
          "min": null,
          "name": "unit_price_cents",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "sddckcja",
          "max": null,
          "min": null,
          "name": "amount_cents",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "yjijabqh",
          "maxSelect": 1,
          "name": "source",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "time_entry",
            "expense",
            "mileage",
            "manual"
          ]
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "iodlhvl0",
          "max": 50,
          "min": 0,
          "name": "source_id",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ywt6ojzz",
          "max": null,
          "min": null,
          "name": "sort_order",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "invoice_lines__",
      "indexes": [
        "CREATE INDEX idx_invoice_lines_invoice ON invoice_line_items (invoice)"
      ],
      "listRule": "@request.auth.id != \"\" && invoice.workspace.owner = @request.auth.id",
      "name": "invoice_line_items",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && invoice.workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && invoice.workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "0ob4uwx0",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "clients________",
          "help": "",
          "hidden": false,
          "id": "fwvqxb1k",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "client",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "w31e8wbv",
          "maxSize": 2000000,
          "name": "template_line_items_json",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "help": "",
          "hidden": false,
          "id": "zvkx7iyl",
          "maxSelect": 1,
          "name": "cadence",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "weekly",
            "monthly",
            "yearly"
          ]
        },
        {
          "help": "",
          "hidden": false,
          "id": "ovxd66dr",
          "max": "",
          "min": "",
          "name": "next_run",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "ysxnylgj",
          "name": "active",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "3theg3qi",
          "name": "auto_send",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "recurring_inv__",
      "indexes": [
        "CREATE INDEX idx_recurring_inv_workspace ON recurring_invoices (workspace)",
        "CREATE INDEX idx_recurring_inv_next_run ON recurring_invoices (next_run)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "recurring_invoices",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "6qyq1wtq",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "invoices_______",
          "help": "",
          "hidden": false,
          "id": "kumt3piy",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "invoice",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "lvlkec6h",
          "max": "",
          "min": "",
          "name": "date",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "help": "",
          "hidden": false,
          "id": "7bcujrfq",
          "max": null,
          "min": 0,
          "name": "amount_cents",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "fydrpahf",
          "maxSelect": 1,
          "name": "method",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "check",
            "ach",
            "cash",
            "card",
            "other"
          ]
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "gsd0x7tf",
          "max": 200,
          "min": 0,
          "name": "reference",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "qbn1yck8",
          "max": 5000,
          "min": 0,
          "name": "notes",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "payments_______",
      "indexes": [
        "CREATE INDEX idx_payments_workspace ON payments (workspace)",
        "CREATE INDEX idx_payments_invoice ON payments (invoice)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "payments",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "deleteRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "q1ozhjji",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "help": "",
          "hidden": false,
          "id": "z3qbtc6t",
          "maxSelect": 1,
          "name": "filing_status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "single",
            "mfj",
            "mfs",
            "hoh"
          ]
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "jxoulc8i",
          "max": 2,
          "min": 0,
          "name": "state",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "k0ev5vjw",
          "max": null,
          "min": null,
          "name": "estimated_other_income_cents",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "rmo5xmss",
          "max": null,
          "min": 0,
          "name": "mileage_rate_cents_per_mile",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "help": "",
          "hidden": false,
          "id": "14mc2hwh",
          "max": null,
          "min": 0,
          "name": "quarterly_safe_harbor_pct",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "tax_settings___",
      "indexes": [
        "CREATE UNIQUE INDEX idx_tax_settings_workspace ON tax_settings (workspace)"
      ],
      "listRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "name": "tax_settings",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id",
      "viewRule": "@request.auth.id != \"\" && workspace.owner = @request.auth.id"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "workspaces_____",
          "help": "",
          "hidden": false,
          "id": "dd5mbb7r",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "workspace",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "38emf8k8",
          "max": 100,
          "min": 0,
          "name": "kind",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "help": "",
          "hidden": false,
          "id": "4ck8ympw",
          "maxSize": 2000000,
          "name": "payload_json",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "help": "",
          "hidden": false,
          "id": "7nxuyv5b",
          "max": "",
          "min": "",
          "name": "processed_at",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "events_outbox__",
      "indexes": [
        "CREATE INDEX idx_events_outbox_kind ON events_outbox (kind)",
        "CREATE INDEX idx_events_outbox_processed_at ON events_outbox (processed_at)"
      ],
      "listRule": null,
      "name": "events_outbox",
      "system": false,
      "type": "base",
      "updateRule": null,
      "viewRule": null
    },
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location:</p>\n<p><em>{ALERT_INFO}</em></p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>If this was you, you may disregard this email.</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "",
      "authToken": {
        "duration": 1209600
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": null,
      "deleteRule": null,
      "emailChangeToken": {
        "duration": 1800
      },
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 0,
          "help": "",
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9]{50}",
          "help": "",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "help": "",
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": true,
          "system": true,
          "type": "email"
        },
        {
          "help": "",
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "help": "",
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "fileToken": {
        "duration": 120
      },
      "id": "pbc_3142635823",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`)",
        "CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != ''"
      ],
      "listRule": null,
      "manageRule": null,
      "mfa": {
        "duration": 600,
        "enabled": false,
        "rule": ""
      },
      "name": "_superusers",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "",
          "id": "",
          "name": "",
          "username": ""
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": true,
      "type": "auth",
      "updateRule": null,
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p><i>If you didn't recently register, please ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 86400
      },
      "viewRule": null
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text2462348188",
          "max": 0,
          "min": 0,
          "name": "provider",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text1044722854",
          "max": 0,
          "min": 0,
          "name": "providerId",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2281828961",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (collectionRef, recordRef, provider)",
        "CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (collectionRef, provider, providerId)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_externalAuths",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text1582905952",
          "max": 0,
          "min": 0,
          "name": "method",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2279338944",
      "indexes": [
        "CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (collectionRef,recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_mfas",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 8,
          "help": "",
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 0,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": true,
          "id": "text3866985172",
          "max": 0,
          "min": 0,
          "name": "sentTo",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_1638494021",
      "indexes": [
        "CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (collectionRef, recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_otps",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "help": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "help": "",
          "hidden": false,
          "id": "text4228609354",
          "max": 0,
          "min": 0,
          "name": "fingerprint",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_4275539003",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (collectionRef, recordRef, fingerprint)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_authOrigins",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    }
  ];

  return app.importCollections(snapshot, false);
}, (app) => {
  return null;
})
