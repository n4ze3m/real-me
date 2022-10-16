import { supabase } from "~/utils/supabase"

export const deleteImagesFromServer = async (images: string[]) => {
    await supabase.storage.from("reals").remove(images)
}