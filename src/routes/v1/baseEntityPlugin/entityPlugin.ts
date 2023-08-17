import { FastifyPluginOptions } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getEntityDAL } from "../../../DB/entityDAL";
import {
  EntitiesMapDB,
  EntitiesMapDBWithoutId,
  getIdJSONSchemaAsQueryParam,
  getPaginationOptionsJSONSchema,
} from "../../../models/general";
import { Application } from "../../../application";
import { env } from "../../../setup/env";
import { logger } from "../../../logging/logger";

export const getEntityPlugin = <T extends keyof EntitiesMapDB>(
  collectionName: T
) => {
  const entityDal = getEntityDAL(collectionName);

  const entityJSONSchema = entityDal.getSchema();
  const entityPartialJSONSchema = entityDal.getPartialSchema();

  // const idSchemaAsQueryParam = getIdJSONSchemaAsQueryParam(); // TODO: decide whether to use this or the one below
  const idSchemaAsQueryParam = {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
      },
    },
  } as const;
  const paginationOptions = getPaginationOptionsJSONSchema();

  const entityPlugin = async (
    fastify: Application,
    _options: FastifyPluginOptions = {},
    done: () => void
  ) => {
    fastify.post(
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

    fastify.get(
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

    fastify.get(
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

    fastify.patch(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
          body: entityPartialJSONSchema,
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

    fastify.delete(
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
