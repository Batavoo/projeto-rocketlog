import { Request, Response } from "express";

class DeliveriesController {
  async create(request: Request, response: Response) {
    return response.json({ message: "Ok" });
  }
}

export { DeliveriesController };
