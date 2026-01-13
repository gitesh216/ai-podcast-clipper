"use server";
import { hashPassword } from "~/lib/auth";
import { signupSchema, type SignupFormValues } from "~/schemas/auth";
import { db } from "~/server/db";
import Stripe from "stripe";

type SignupResult = {
  success: boolean;
  error?: string;
};

export async function signUp(data: SignupFormValues): Promise<SignupResult> {
  const validationResult = signupSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { email, password } = validationResult.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        success: false,
        error: "Email already in use",
      };
    }

    const hashedPassword = await hashPassword(password);

    // const stripe = new Stripe("Todo: STRIPE_KEY");
    // console.log("Reached here")
    // const stripeCustomer = await stripe.customers.create({
    //   email: email.toLowerCase(),
    // });
    // console.log("Stripe Customer ", stripeCustomer)



    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        stripeCustomerId: `${email}STRIPE_ID_PLACEHOLDER`,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "An error occured during signup" };
  }
}
