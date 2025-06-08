import e, { Express, Request, Response } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getUserByIdHandler,
  loginUserHandler,
  updateEmailHandler,
  updatePasswordHandler,
} from "./controller/user.controller";
import {
  createUserSchema,
  getUserByIdSchema,
  loginUserSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "./schema/user.schema";
import {
  invalidateTokenHandler,
  reissueAccessTokenHandler,
} from "./controller/token.controller";
import validateResource from "./middleware/validateResource";
import {
  invalidateTokenSchema,
  reissueTokenSchema,
} from "./schema/token.schema";
import { Endpoints } from "./utils/options";
import requireUser from "./middleware/requireUser";
import authenticate from "./middleware/authenticate";

export default function routes(app: Express) {
  app.get(Endpoints.HC, (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  /**
   * @openapi
   * '/api/users/sign-up':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      401:
   *        description: Unauthorized
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    Endpoints.SIGNUP,
    authenticate,
    validateResource(createUserSchema),
    createUserHandler,
  );

  /**
   * @openapi
   * '/api/users/login':
   *  post:
   *     tags:
   *     - User
   *     summary: Login a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/LoginUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginUserResponse'
   *      404:
   *        description: Not found
   *      401:
   *        description: Unauthorized
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    Endpoints.LOGIN,
    authenticate,
    validateResource(loginUserSchema),
    loginUserHandler,
  );

  /**
   * @openapi
   * '/api/users/{userId}':
   *  get:
   *     tags:
   *     - User
   *     summary: Get a user by ID
   *     parameters:
   *     - in: path
   *       name: userId
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetUserByIdResponse'
   *      404:
   *        description: Not found
   *      401:
   *        description: Unauthorized
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.get(
    Endpoints.GET_USER,
    authenticate,
    requireUser,
    validateResource(getUserByIdSchema),
    getUserByIdHandler,
  );

  /**
   * @openapi
   * '/api/users/{userId}/update-email':
   *   put:
   *     tags:
   *       - User
   *     summary: Update a user's email
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateEmailInput'
   *     responses:
   *       '204':
   *         description: Success
   *       '404':
   *         description: Not found
   *       '401':
   *         description: Unauthorized
   *       '400':
   *         description: Bad request
   *       '500':
   *         description: Internal server error # This is a proper YAML comment
   */
  app.put(
    Endpoints.UPDATE_EMAIL,
    authenticate,
    requireUser,
    validateResource(updateEmailSchema),
    updateEmailHandler,
  );

  /**
   * @openapi
   * '/api/users/{userId}/update-password':
   *   put:
   *     tags:
   *       - User
   *     summary: Update a user's password
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePasswordInput'
   *     responses:
   *       '204':
   *         description: Success
   *       '404':
   *         description: Not found
   *       '401':
   *         description: Unauthorized
   *       '400':
   *         description: Bad request
   *       '500':
   *         description: Internal server error
   */
  app.put(
    Endpoints.UPDATE_PASSWORD,
    authenticate,
    requireUser,
    validateResource(updatePasswordSchema),
    updatePasswordHandler,
  );

  app.post(Endpoints.SEND_VERIFICATION_EMAIL);

  app.put(Endpoints.VERIFY_EMAIL);

  /**
   * @openapi
   * '/api/users/{userId}':
   *   delete:
   *     tags:
   *       - User
   *     summary: Delete a user
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Success
   *       '404':
   *         description: Not found
   *       '401':
   *         description: Unauthorized
   *       '400':
   *         description: Bad request
   *       '500':
   *         description: Internal server error
   */
  app.delete(
    Endpoints.DELETE_USER,
    authenticate,
    requireUser,
    validateResource(getUserByIdSchema),
    deleteUserHandler,
  );

  /**
   * @openapi
   * '/api/tokens/reissue-token':
   *  get:
   *    tags:
   *      - Tokens
   *    summary: Reissue a JWT accesstoken.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ReissueTokenInput'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ReissueTokenResponse'
   *      401:
   *        description: Unauthorized
   *      404:
   *        description: Not found
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    Endpoints.REISSUE_TOKEN,
    authenticate,
    validateResource(reissueTokenSchema),
    reissueAccessTokenHandler,
  );

  /**
   * @openapi
   * '/api/tokens/invalidate-token':
   *  post:
   *     tags:
   *     - Tokens
   *     summary: Invalidate a token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InvalidateTokenInput'
   *     responses:
   *       204:
   *         description: Success
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.post(
    Endpoints.INVALIDATE_TOKEN,
    authenticate,
    validateResource(invalidateTokenSchema),
    invalidateTokenHandler,
  );
}
