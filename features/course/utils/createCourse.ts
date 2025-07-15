import { supabase } from "@/lib/supabase";
import { aiClient } from "./chunkAI/ai/aiClient";
import { Result } from "./chunkReference";

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface CreateCourseOptions {
  text: string;
  userId: string;
  category?: string;
  level?: string;
  price?: number;
  tags?: string[];
}

export async function createCourse({
  text,
  userId,
  price = 0,
}: CreateCourseOptions): Promise<Result<{id: string}>> {
  // 1. Generate course metadata using AI
  const {err, res} = await aiClient.generateCourseMetadata(text);
  if(err||!res){
    return {err: "error while generating course metadata at ./createCourse.ts" , res: null }
  }
  const { title, description, category, level, tags } = res;

  // 2. Insert course into the database
  const { data: course, error } = await supabase
  .from("courses")
  .insert([
      {
        title,
        description,
        content: text,
        owner_id: userId,
        category,
        level,
        price,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
  ])
  .select()
  .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return {err: error.message,res: null}
  }

  return { err: null, res: {id: course.id} };
}

// Simple test runner for manual testing
if (require.main === module) {
  (async () => {
      const {err  , res } = await createCourse({
        text: "Apprenez à réaliser un bœuf bourguignon traditionnel, mijoté lentement pendant plusieurs heures pour obtenir une viande tendre et une sauce riche en saveurs : commencez par découper 1,5 kg de bœuf à braiser en gros cubes, puis faites-les revenir dans une cocotte avec un filet d’huile d’olive jusqu’à ce qu’ils soient bien dorés sur toutes les faces ; réservez la viande et dans la même cocotte, faites revenir 200 g de lardons fumés, 2 oignons émincés, 3 carottes coupées en rondelles et 2 gousses d’ail hachées, ajoutez ensuite 2 cuillères à soupe de farine et mélangez bien ; remettez la viande dans la cocotte, versez 75 cl de vin rouge corsé (type Bourgogne), ajoutez un bouquet garni, salez, poivrez, portez à ébullition puis couvrez et laissez mijoter à feu doux pendant 3 heures ; une heure avant la fin de la cuisson, ajoutez 250 g de champignons de Paris émincés et rectifiez l’assaisonnement si nécessaire ; servez bien chaud avec des pommes de terre vapeur, des tagliatelles fraîches ou du pain de campagne grillé pour accompagner cette recette emblématique de la cuisine française, parfaite pour les repas d’hiver, les occasions spéciales ou les grands repas familiaux où la convivialité est de mise ; ce plat, meilleur réchauffé le lendemain, peut aussi être préparé à l’avance et congelé pour plus de praticité sans perdre en goût ni en texture.",
        userId: "test-user-id",
        price: 0
      });

      if (err || !res) {
        console.error("createCourse error:", err);
        return;
      }
      // Now TypeScript knows res is not null
      const id = res.id;
      console.log("createCourse result:", id );
  })();
} 