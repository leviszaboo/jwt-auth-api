import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) return res.status(400).send(err.errors);

      return res.status(500).send("Internal server error.");
    }
  };

export default validateResource;
