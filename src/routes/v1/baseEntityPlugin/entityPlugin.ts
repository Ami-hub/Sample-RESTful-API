import { FastifyPluginOptions } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getEntityDAL } from "../../../DB/entityDAL";
import {
  EntitiesMapDB,
  getIdJSONSchemaAsQueryParam,
  getPaginationOptionsJSONSchema,
} from "../../../types/general";
import { Application } from "../../../types/application";
import { env } from "../../../setup/env";

export const getEntityPlugin = async <T extends keyof EntitiesMapDB>(
  collectionName: T
) => {
  const entityDal = getEntityDAL(collectionName);
  const entityJSONSchema = entityDal.getSchema();
  const entityPartialJSONSchema = entityDal.getPartialSchema();
  const idSchemaAsQueryParam = getIdJSONSchemaAsQueryParam();
  const paginationOptions = getPaginationOptionsJSONSchema();
  const entityPlugin = async (
    fastify: Application,
    _options: FastifyPluginOptions = {}
  ) => {
    fastify.post(
      `/`,
      {
        schema: {
          body: entityJSONSchema,
        },
      },
      async (request, reply) => {
        const created = await entityDal.create(request.body);
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
        const offset = request.query.offset || 0;
        const limit = request.query.limit || env.DEFAULT_PAGE_SIZE;
        const safeLimit = limit > env.MAX_PAGE_SIZE ? env.MAX_PAGE_SIZE : limit;
        const entities = await entityDal.get(offset, safeLimit);
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
        const updated = await entityDal.update(request.params.id, request.body);
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
  };

  return entityPlugin;
};
