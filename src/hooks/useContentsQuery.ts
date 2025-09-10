import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Content {
  id: string;
  titulo: string;
  tipo: "ebook" | "desenho";
  url_capa: string;
  url_arquivo: string;
  created_at: string;
  updated_at: string;
}

export const useContentsQuery = () => {
  return useQuery<Content[], Error>({
    queryKey: ["conteudos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conteudos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Content[]) ?? [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
