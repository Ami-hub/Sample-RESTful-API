import { FastifyPluginOptions } from "fastify";
import { StatusCodes } from "http-status-codes";

import { BaseEntityDAL } from "../../../DB/DALs/baseEntityDAL";
import {
  EntitiesMap,
  EntitiesMapDBWithoutId,
} from "../../../models/entitiesMaps";
import { Application } from "../../../application";
import { env } from "../../../setup/env";
import {
  jsonSchemaInteger,
  toPartialJSONSchema,
} from "../../../models/jsonSchemaHelpers";
import { idJsonSchema } from "../../../models/id";

const idSchemaAsQueryParam = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: idJsonSchema,
  },
  required: ["id"],
} as const;

const paginationOptions = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      limit: jsonSchemaInteger,
      offset: jsonSchemaInteger,
    },
  } as const,
};

export const getBaseEntityPlugin = <T extends keyof EntitiesMap>(
  entityDal: BaseEntityDAL<T>
) => {
  return async (
    protectedRoutes: Application,
    _options: FastifyPluginOptions = {},
    done: () => void
  ) => {
    const entityJSONSchema = entityDal.getSchema();
    protectedRoutes.post(
      `/`,
      {
        schema: {
          body: entityJSONSchema,
        },
      },
      async (request, reply) => {
        const created = await entityDal.create(
          request.body as EntitiesMapDBWithoutId[T]
        );
        reply.status(StatusCodes.CREATED).send(created);
      }
    );

    protectedRoutes.get(
      `/`,
      {
        schema: {
          querystring: paginationOptions.querystring,
        },
      },
      async (request, reply) => {
        const offset = request.query.offset ?? 0;
        const limit = request.query.limit ?? env.DEFAULT_PAGE_SIZE;
        const safeLimit = limit > env.MAX_PAGE_SIZE ? env.MAX_PAGE_SIZE : limit;
        const entities = await entityDal.get({
          offset,
          limit: safeLimit,
        });
        reply.status(StatusCodes.OK).send(entities);
      }
    );

    protectedRoutes.get(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
        },
      },
      async (request, reply) => {
        const entity = await entityDal.getById(request.params.id);
        reply.status(StatusCodes.OK).send(entity);
      }
    );

    protectedRoutes.patch(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
          body: toPartialJSONSchema(entityJSONSchema),
        },
      },
      async (_request, reply) => {
        reply.status(StatusCodes.METHOD_NOT_ALLOWED).send({
          message: `PATCH method is not allowed in the deployed version`,
        });
      }
    );

    protectedRoutes.delete(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
        },
      },
      async (_request, reply) => {
        reply
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .send(`DELETE method is not allowed in the deployed version`);
      }
    );

    done();
  };
};
