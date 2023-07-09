import { FastifyPluginOptions } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getEntityDAL } from "../../../DB/entityDAL";
import {
  EntitiesMapDB,
  getIdJSONSchemaAsQueryParam,
  getPaginationOptionsJSONSchema,
} from "../../../types/general";
import { getTheaterJSONSchema } from "../../../types/theater";
import { Application } from "../../../application";

export const getTheaterPlugin = async <T extends keyof EntitiesMapDB>(
  collectionName: T
) => {
  const theaterDal = getEntityDAL(collectionName);
  const idSchemaAsQueryParam = getIdJSONSchemaAsQueryParam();
  const paginationOptions = getPaginationOptionsJSONSchema();
  const theaterSchema = getTheaterJSONSchema(); // TODO: consider moving getTheaterJSONSchema to theaterDAL
  const theaterPlugin = async (
    fastify: Application,
    _options: FastifyPluginOptions = {}
  ) => {
    fastify.post(
      `/`,
      {
        schema: {
          body: theaterSchema,
        },
      },
      async (request, reply) => {
        const created = await theaterDal.create(request.body);
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
      (request, reply) => {
        const { limit, offset } = request.query;
        const theaters = theaterDal.get(offset, limit);
        reply.status(StatusCodes.OK).send(theaters);
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
        const theater = await theaterDal.getById(request.params.id);
        reply.status(StatusCodes.OK).send(theater);
      }
    );

    fastify.put(
      `/:id`,
      {
        schema: {
          params: idSchemaAsQueryParam,
        },
      },

      async (request, reply) => {
        const updated = await theaterDal.update(
          request.params.id,
          request.body
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
        const deleted = await theaterDal.delete(request.params.id);
        reply.status(StatusCodes.OK).send(deleted);
      }
    );
  };

  return theaterPlugin;
};
