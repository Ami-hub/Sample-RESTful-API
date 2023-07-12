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
  const idSchemaAsQueryParam = getIdJSONSchemaAsQueryParam();
  const paginationOptions = getPaginationOptionsJSONSchema();
  const entityJSONSchema = entityDal.getSchema();
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
        const limit = request.query.limit || env.DEFAULT_READ_LIMIT;
        const safeLimit =
          limit > env.MAX_READ_LIMIT ? env.MAX_READ_LIMIT : limit;
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

    fastify.put(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
          // body: {}, // TODO: add partial schema
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
