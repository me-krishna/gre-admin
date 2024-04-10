import { supabase } from "../api";
import { errorResponse, sucessResponse } from "../utils";

export async function getTracking(
  recordsPerPage: number,
  page: number,
  filterParams?: {
    campainId: string;
    formFilled: string;
  }
) {
  let query = supabase.from("mth_user_track").select("*", { count: "exact" });
  if (filterParams) {
    if (filterParams.campainId !== "all") {
      query = query.eq("tk", filterParams.campainId);
    }
    if (filterParams.formFilled !== "all") {
      if (filterParams.formFilled === "no") {
        query = query.is("form_id", null);
      } else {
        query = query.not("form_id", "is", null);
      }
    }
  }
  const { data, error, count } = await query
    .range(recordsPerPage * page - recordsPerPage, recordsPerPage * page - 1)
    .order("id", { ascending: false });

  if (error) {
    return errorResponse(error);
  }

  return sucessResponse(data, count ? count : 0);
}
export async function getFromData(formId: number) {
  const { data, error, count } = await supabase
    .from("miles_talent_hub")
    .select("*", { count: "exact" })
    .eq("id", formId);

  if (error) {
    return errorResponse(error);
  }

  return sucessResponse(data, count ? count : 0);
}

export async function getCampainList() {
  const { data, error, count } = await supabase
    .from("mth_campagin")
    .select("tk,name", { count: "exact" });
  if (error) {
    return errorResponse(error);
  }
  return sucessResponse(data, count ? count : 0);
}
