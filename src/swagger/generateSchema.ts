import * as z from "zod/v4";
import { createDocument } from "zod-openapi";
import {
  chatItemZodSchema,
  chatZodSchema,
  colorsEnum,
  commentCreateZodSchema,
  commentUpdateZodSchema,
  commentZodSchema,
  createMessageZodSchema,
  editProjectZodSchema,
  entityEnum,
  fullUserZodSchema,
  iconsEnum,
  kanbanTaskZodSchema,
  loginZodSchema,
  messageZodSchema,
  priorityEnum,
  projectOverviewZodSchema,
  projectStatusEnum,
  projectZodSchema,
  registrationZodSchema,
  singleProjectZodSchema,
  singleTaskZodSchema,
  subtaskRowZodSchema,
  tagZodSchema,
  taskStatusEnum,
  taskZodSchema,
  updateTaskZodSchema,
  userWithTokensZodSchema,
  userZodSchema,
} from "./zod-schemas";
import {
  projectCreateZodSchema,
  taskCreateZodSchema,
} from "./zod-schemas/create";
import { activityZodSchema } from "./zod-schemas/activity";

export const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": { schema: loginZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: userWithTokensZodSchema },
            },
          },
        },
      },
    },
    "/api/auth/refetch": {
      get: {
        tags: ["Auth"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: userWithTokensZodSchema },
            },
          },
        },
      },
    },
    "/api/auth/registration": {
      post: {
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": { schema: registrationZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: z.lazy(() => userWithTokensZodSchema),
              },
            },
          },
        },
      },
    },
    "/api/tasks": {
      get: {
        parameters: [
          {
            name: "priority",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["Low", "Medium", "Hight"],
            },
          },
          {
            name: "assignee",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "project",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        tags: ["Tasks"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(kanbanTaskZodSchema) },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        requestBody: {
          content: {
            "application/json": { schema: taskCreateZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: taskZodSchema },
            },
          },
        },
      },
    },
    "/api/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Tasks"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: singleTaskZodSchema },
            },
          },
        },
      },
      patch: {
        tags: ["Tasks"],
        requestBody: {
          content: {
            "application/json": { schema: updateTaskZodSchema.partial() },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: singleTaskZodSchema },
            },
          },
        },
      },
    },
    "/api/tasks/{id}/comments": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Tasks"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(commentZodSchema) },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        requestBody: {
          content: {
            "application/json": { schema: commentCreateZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: commentZodSchema },
            },
          },
        },
      },
    },
    "/api/tasks/{taskId}/comments/{commentId}": {
      parameters: [
        {
          name: "taskId",
          in: "path",
        },
        {
          name: "commentId",
          in: "path",
        },
      ],
      patch: {
        tags: ["Tasks"],
        requestBody: {
          content: {
            "application/json": { schema: commentUpdateZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: commentZodSchema },
            },
          },
        },
      },
    },
    "/api/tasks/{id}/activity": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Tasks"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(activityZodSchema) },
            },
          },
        },
      },
    },
    "/api/projects": {
      get: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(projectZodSchema) },
            },
          },
        },
      },
      post: {
        tags: ["Projects"],
        requestBody: {
          content: {
            "application/json": { schema: projectCreateZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: projectZodSchema },
            },
          },
        },
      },
    },
    "/api/projects/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: singleProjectZodSchema },
            },
          },
        },
      },
      put: {
        tags: ["Projects"],
        requestBody: {
          content: {
            "application/json": {
              schema: editProjectZodSchema,
            },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: singleProjectZodSchema },
            },
          },
        },
      },
      delete: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: { message: z.string() } },
            },
          },
        },
      },
    },
    "/api/projects/{id}/overview": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: projectOverviewZodSchema },
            },
          },
        },
      },
    },
    "/api/projects/{id}/activity": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(activityZodSchema) },
            },
          },
        },
      },
    },
    "/api/projects/{id}/members": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Projects"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: z.array(
                  userZodSchema.extend({
                    assignedTasks: z.number(),
                  }),
                ),
              },
            },
          },
        },
      },
    },
    "/api/activity": {
      get: {
        tags: ["Activity"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(activityZodSchema) },
            },
          },
        },
      },
    },

    "/api/users": {
      get: {
        tags: ["Users"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(userZodSchema) },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Users"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: fullUserZodSchema },
            },
          },
        },
      },
    },
    "/api/chats": {
      get: {
        tags: ["Users"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: z.object({
                  chats: z.array(chatItemZodSchema),
                }),
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        requestBody: {
          content: {
            "application/json": {
              schema: z.object({
                members: z.array(z.string()),
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: chatZodSchema,
              },
            },
          },
        },
      },
    },
    "/api/chats/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      get: {
        tags: ["Users"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: chatZodSchema,
              },
            },
          },
        },
      },
    },
    "/api/chats/{id}/messages": {
      parameters: [
        {
          name: "id",
          in: "path",
        },
      ],
      post: {
        tags: ["Users"],
        requestBody: {
          content: {
            "application/json": { schema: createMessageZodSchema },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": {
                schema: messageZodSchema,
              },
            },
          },
        },
      },
    },
    "/api/tags": {
      get: {
        tags: ["Tags"],
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: z.array(tagZodSchema) },
            },
          },
        },
      },
      post: {
        tags: ["Tags"],
        requestBody: {
          content: {
            "application/json": { schema: z.object({ name: z.string() }) },
          },
        },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: tagZodSchema },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TaskStatus: taskStatusEnum,
      Priority: priorityEnum,
      ProjectStatus: projectStatusEnum,
      Colors: colorsEnum,
      Icons: iconsEnum,
      EntityType: entityEnum,
      Tag: tagZodSchema,
      User: userZodSchema,
      Comment: commentZodSchema,
      Task: taskZodSchema,
      TaskCreate: taskCreateZodSchema,
      SingleTask: singleTaskZodSchema,
      KanbanTask: kanbanTaskZodSchema,
      SubTaskRow: subtaskRowZodSchema,
      Project: projectZodSchema,
      ProjectOverview: projectOverviewZodSchema,
      ProjectPut: editProjectZodSchema,
      ChatItem: chatItemZodSchema,
      Chat: chatZodSchema,
      // Project: projectZodSchema,
      // Project: projectZodSchema,
      ProjectCreate: projectCreateZodSchema,
      Activity: activityZodSchema,
    },
  },
});
