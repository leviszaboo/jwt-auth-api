import { TypeOf, object, string } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *    LoginUserResponse:
 *      type: object
 *      properties:
 *        user_id:
 *          type: string
 *        email:
 *          type: string
 *        email_verified:
 *          type: integer
 *          minimum: 0
 *          maximum: 1
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 */
export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is a required field.",
    }).email("Please enter a valid email adress"),
    password: string({
      required_error: "Password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        user_id:
 *          type: string
 *        email_verified:
 *          type: integer
 *          minimum: 0
 *          maximum: 1
 */
export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is a required field.",
    }).email("Please enter a valid email adress"),
    password: string({
      required_error: "Password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateEmailInput:
 *      type: object
 *      required:
 *        - newEmail
 *      properties:
 *        newEmail:
 *          type: string
 */
export const updateEmailSchema = object({
  body: object({
    newEmail: string({
      required_error: "New email is a required field.",
    }).email("Please enter a valid email adress"),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdatePasswordInput:
 *      type: object
 *      required:
 *        - newPassword
 *      properties:
 *        newPassword:
 *          type: string
 */
export const updatePasswordSchema = object({
  body: object({
    newPassword: string({
      required_error: "New password is a required field.",
    }).min(8, "Password must be at least 8 characters long."),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    GetUserByIdInput:
 *      type: object
 *      required:
 *        - userId
 *      properties:
 *        userId:
 *          type: string
 *    GetUserByIdResponse:
 *      type: object
 *      properties:
 *        user_id:
 *          type: string
 *        email:
 *          type: string
 *        email_verified:
 *          type: integer
 *          minimum: 0
 *          maximum: 1
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 */
const params = {
  params: object({
    userId: string({
      required_error: "User ID is required.",
    }),
  }),
};

export const getUserByIdSchema = object({ ...params });

export type GetUserByIdInput = TypeOf<typeof getUserByIdSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type UpdateEmailInput = TypeOf<typeof updateEmailSchema>;
export type UpdatePasswordInput = TypeOf<typeof updatePasswordSchema>;
