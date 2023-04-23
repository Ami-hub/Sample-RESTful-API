import { z } from "zod";
import {
  customerSchema,
  tierAndDetailsSchema,
  tiersSchema,
} from "../validators/customerValidator";

/**
 * Represents an tier, one of `Bronze`, `Silver`, `Gold`, `Platinum`.
 *
 * @example
 * ```ts
 * const tier: Tier = "Bronze";
 * ```
 */
export type Tier = z.infer<typeof tiersSchema>;

/**
 * Represents an tier and details object.
 * @property `tier` - The tier of the customer.
 * @see {@link Tier} for possible values.
 * @property `benefits` - The benefits of the customer.
 * @property `active` - The active status of the customer.
 * @property `id` - The ID of the customer.
 *
 * @example
 * ```ts
 * const tierAndDetails: TierAndDetails =
 * {
 *  tier: "Bronze",
 *  benefits: ["24 hour dedicated line", "concierge services"],
 *  active: true,
 *  id: "699456451cc24f028d2aa99d7534c219",
 * }
 * ```
 */
export type TierAndDetails = z.infer<typeof tierAndDetailsSchema>;

/**
 * Represents an cusomer object.
 * @property `_id` - The ID of the customer.
 * @property `username` - The username of the customer.
 * @property `name` - The name of the customer.
 * @property `active` - The active status of the customer.
 * @property `address` - The address of the customer.
 * @property `birthdate` - The birthdate of the customer.
 * @property `email` - The email of the customer.
 * @property `accounts` - The array of accounts associated with the customer.
 * @property `tier_and_details` - The tier and details of the customer.
 * @see {@link TierAndDetails}
 *
 * @example
 * ```ts
 * const customer: Customer =
 * {
 *   _id: myCustomerId,
 *   username: "fmiller",
 *   name: "Elizabeth Ray",
 *   address: "9286 Bethany Glens\nVasqueztown, CO 22939",
 *   birthdate: new Date("1977-03-02T02:20:31Z"),
 *   email: "arroyocolton@gmail.com",
 *   active: true,
 *   accounts: [371138, 422649, 387979],
 *   tier_and_details: {
 *     "<TierAndDetails1Id>": <TierAndDetails1>,
 *     "<TierAndDetails2Id>": <TierAndDetails2>
 *   }
 * };
 * ```
 */
export type Customer = z.infer<typeof customerSchema>;
