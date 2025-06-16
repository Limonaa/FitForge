import "dotenv/config";
import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseEmail = process.env.VITE_SUPABASE_EMAIL;
const supabasePassword = process.env.VITE_SUPABASE_PASSWORD;

async function seed() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: supabaseEmail,
        password: supabasePassword,
      });

    if (loginError) {
      console.error("Login error:", loginError);
      return;
    }

    const accessToken = loginData.session?.access_token;
    if (!accessToken) {
      console.error("No access token received");
      return;
    }

    const supabaseWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    await supabaseWithAuth
      .from("food_entries")
      .delete()
      .eq("user_id", loginData.user.id);

    const foodEntries = Array.from({ length: 20 }, () => ({
      user_id: loginData.user.id,
      name: faker.food.dish(),
      calories: faker.number.int({ min: 400, max: 2200 }),
      protein: faker.number.int({ min: 10, max: 130 }),
      carbs: faker.number.int({ min: 10, max: 500 }),
      fats: faker.number.int({ min: 1, max: 120 }),
      meal_type: faker.helpers.arrayElement([
        "breakfast",
        "lunch",
        "dinner",
        "snack",
      ]),
      date: new Date(
        Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10),
    }));

    const { error: insertError } = await supabaseWithAuth
      .from("food_entries")
      .insert(foodEntries);

    if (insertError) {
      console.error("Seed error:", insertError);
    } else {
      console.log("Seed success!");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

seed();
