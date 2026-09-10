import { supabase } from "./supabase";

export async function testSupabaseConnection() {
    const { data, error } = await supabase
        .from("waste_reports")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Supabase connection error:", error);
        return;
    }

    console.log("Supabase connected successfully:", data);
}