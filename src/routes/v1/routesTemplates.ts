import { StatusCodes } from "http-status-codes";
import { EntitiesMapDB, idSchema } from "../../../types/general";
import { getEntityDAL } from "../../../DB/entityDAL";
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../../setup/env";

export const getXxxRoutes = (collectionName: keyof EntitiesMapDB) => {
  const xxxDAL = getEntityDAL(collectionName);

  const getAll = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    // TODO: add validation
    const start: number = (request.query as any)["start"] || 0;
    const end: number =
      (request.query as any)["end"] || start + env.DEFAULT_READ_LIMIT;

    const safeEnd =
      end - start > env.MAX_READ_LIMIT ? start + env.DEFAULT_READ_LIMIT : end;

    const entities = await xxxDAL.get(start, safeEnd);
    reply.send(entities);
    done();
  };

  const getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const id = (request.params as any).id; // TODO: add validation
    const entity = await xxxDAL.getOneById(id);
    if (!entity) {
      reply
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `No such ${collectionName} '${id.toString()}'` });
      return;
    }

    reply.send(entity);
    done();
  };

  const create = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const created = await xxxDAL.create(request.body);
    reply.status(StatusCodes.CREATED).send(created);
  };

  const update = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const updated = await xxxDAL.update(
      (request.params as any).id, // TODO: add validation
      request.body
    );
    reply.send(updated);
    done();
  };

  const deleteOne = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const id = (request.params as any).id; // TODO: add validation
    const deleted = await xxxDAL.delete(id);
    reply.send(deleted);
    done();
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
