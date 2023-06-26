import { StatusCodes } from "http-status-codes";
import { EntitiesMap, idSchema } from "../../../types/general";
import { getEntityDAL } from "../../../DB/entityDAL";
import { FastifyReply, FastifyRequest } from "fastify";

export const getXxxRoutes = (collectionName: keyof EntitiesMap) => {
  const xxxDAL = getEntityDAL(collectionName);

  const getAll = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const entities = await xxxDAL.getAll();
    reply.send(entities);
  };

  const getById = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const id = idSchema.parse((request.params as any).id); // TODO: add validation
    const entity = await xxxDAL.getById(id);
    if (!entity) {
      reply
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `No such ${collectionName} '${id.toString()}'` });
      return;
    }

    reply.send(entity);
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
  };

  const deleteOne = async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    const id = idSchema.parse((request.params as any).id); // TODO: add validation
    const deleted = await xxxDAL.delete(id);
    reply.send(deleted);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
