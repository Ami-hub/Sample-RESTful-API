import { FastifyPluginOptions } from "fastify";
import { StatusCodes } from "http-status-codes";

import { getBaseEntityDAL } from "../../../DB/DALs/baseEntityDAL";
import {
  EntitiesMapDB,
  EntitiesMapDBWithoutId,
} from "../../../models/entitiesMaps";
import { Application } from "../../../application";
import { env } from "../../../setup/env";
import { toPartialJSONSchema } from "../../../models/jsonSchemaHelpers";
import { idJsonSchema } from "../../../models/id";

const idSchemaAsQueryParam = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: idJsonSchema,
  },
} as const;

const paginationOptions = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      limit: { type: "number" },
      offset: { type: "number" },
    },
  } as const,
};

export const getEntityPlugin = <T extends keyof EntitiesMapDB>(
  collectionName: T
) => {
  const entityDal = getBaseEntityDAL(collectionName);

  const entityJSONSchema = entityDal.getSchema();

  const entityPlugin = async (
    protectedRoutes: Application,
    _options: FastifyPluginOptions = {},
    done: () => void
  ) => {
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
      async (request, reply) => {
        const updated = await entityDal.update(
          request.params.id,
          // `as any` is needed due to `Type instantiation is excessively deep and possibly infinite` error
          request.body as any as EntitiesMapDBWithoutId[T]
        );
        reply.status(StatusCodes.OK).send(updated);
      }
    );

    protectedRoutes.delete(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
        },
      },
      async (request, reply) => {
        const deleted = await entityDal.delete(request.params.id);
        reply.status(StatusCodes.OK).send(deleted);
      }
    );

    done();
  };

  return entityPlugin;
};
