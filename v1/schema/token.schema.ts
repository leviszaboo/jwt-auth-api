import { TypeOf, object, string } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    ReissueTokenInput:
 *      type: object
 *      required:
 *        - refreshToken
 *      properties:
 *        refreshToken:
 *          type: string
 *    ReissueTokenResponse:
 *      type: object
 *      properties:
 *        user_id:
 *          type: string
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 */
export const reissueTokenSchema = object({
  body: object({
    refreshToken: string({
      required_error: "Refresh token is a required field.",
    }),
  }),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    InvalidateTokenInput:
 *      type: object
 *      required:
 *        - refreshToken
 *        - accessToken
 *      properties:
 *        refreshToken:
 *          type: string
 *        accessToken:
 *          type: string
 */
export const invalidateTokenSchema = object({
  body: object({
    accessToken: string({
      required_error: "Access token is a required field.",
    }),
    refreshToken: string({
      required_error: "Refresh token is a required field.",
    }),
  }),
});

export type ReissueTokenInput = TypeOf<typeof reissueTokenSchema>;
export type InvalidateTokenInput = TypeOf<typeof invalidateTokenSchema>;
