import { supabase } from "../api";
import { errorResponse, sucessResponse } from "../utils";

export async function getListOfLeads(recordsPerPage: number, page: number) {
  const { data, error, count } = await supabase
    .from("miles_talent_hub")
    .select("*", { count: "exact" })
    .range(recordsPerPage * page - recordsPerPage, recordsPerPage * page - 1)
    .order("id", { ascending: false });
  if (error) {
    return errorResponse(error);
  }
  return sucessResponse(data, count ? count : 0);
}
