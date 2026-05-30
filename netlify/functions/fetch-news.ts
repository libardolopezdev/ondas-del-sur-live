import { createClient } from "@supabase/supabase-js";
import type { Config } from "@netlify/functions";

// ── Supabase client (server-side, uses process.env) ──────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Municipalities grouped by category ───────────────────────────────────────
const PROVINCIA_NORTE = [
  "Sativasur", "Sativanorte", "Soatá", "Boavita", "Covarachía",
  "La Uvita", "San Mateo", "Susacón", "Tipacoque",
];

const PROVINCIA_GUTIERREZ = [
  "Chiscas", "Güicán", "El Espino", "Guacamayas", "Panqueba", "El Cocuy",
];

const GARCIA_ROVIRA = [
  "Málaga", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Concepción",
  "Enciso", "Guaca", "Macaravita", "Molagavita", "San Andrés",
  "San José de Miranda", "San Miguel",
];

const LOCAL_KEYWORDS = [...PROVINCIA_NORTE, ...PROVINCIA_GUTIERREZ];
const REGIONAL_KEYWORDS = ["Boyacá", ...GARCIA_ROVIRA];

// ── Search queries (one per region group) ────────────────────────────────────
const SEARCH_QUERIES = [
  // Provincia Norte de Boyacá
  `Boyacá AND (${PROVINCIA_NORTE.join(" OR ")})`,
  // Provincia Gutiérrez de Boyacá
  `Boyacá AND (${PROVINCIA_GUTIERREZ.join(" OR ")})`,
  // García Rovira – Santander
  `Santander AND (${GARCIA_ROVIRA.join(" OR ")})`,
  // Colombia general
  "Colombia",
];

// ── Category classifier ─────────────────────────────────────────────────────
function classify(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Local: mentions any Provincia Norte or Gutiérrez municipality
  if (LOCAL_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))) {
    return "Local";
  }
  // Regional: mentions Boyacá or any García Rovira municipality
  if (REGIONAL_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))) {
    return "Regional";
  }
  // Nacional: everything else (Colombia-wide)
  return "Nacional";
}

// ── NewsAPI types ────────────────────────────────────────────────────────────
interface NewsArticle {
  title: string;
  description: string | null;
  urlToImage: string | null;
  url: string;
  publishedAt: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// ── Fetch articles for a single query ────────────────────────────────────────
async function fetchArticles(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) throw new Error("NEWSAPI_KEY env variable is not set");

  const params = new URLSearchParams({
    q: query,
    language: "es",
    sortBy: "publishedAt",
    pageSize: "10",
    domains: "eltiempo.com,elespectador.com,semana.com,caracol.com.co,caracoltv.com,rcnradio.com,noticiasrcn.com,bluradio.com,larepublica.co,portafolio.co,elcolombiano.com,elpais.com.co,vanguardia.com,elheraldo.co,eluniversal.com.co,las2orillas.co,pulzo.com,infobae.com/colombia,noticias.canal1.com.co,canalrcn.com,minuto30.com,kienyke.com,lafm.com.co,wradio.com.co,colombiacheck.com,cromos.com.co,boyacacultural.gov.co,extra.com.co,hsbnoticias.com,colombia.com",
    apiKey,
  });

  const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
  if (!res.ok) {
    const body = await res.text();
    console.error(`NewsAPI error for query "${query}": ${res.status} – ${body}`);
    return [];
  }

  const data: NewsAPIResponse = await res.json();
  return data.articles ?? [];
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler() {
  console.log("⏰ fetch-news: starting scheduled run…");

  // 1. Collect articles from all search queries
  const allArticles: NewsArticle[] = [];
  for (const query of SEARCH_QUERIES) {
    const articles = await fetchArticles(query);
    console.log(`  → "${query}" returned ${articles.length} articles`);
    allArticles.push(...articles);
  }

  // 2. Deduplicate by title within the fetched batch
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (!a.title || seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });
  console.log(`  ✓ ${unique.length} unique articles after dedup`);

  // 3. Fetch existing titles from Supabase to avoid DB duplicates
  const { data: existing } = await supabase
    .from("news")
    .select("title");
  const existingTitles = new Set((existing ?? []).map((r: { title: string }) => r.title));

  // 4. Insert new articles
  let inserted = 0;
  for (const article of unique) {
    if (existingTitles.has(article.title)) {
      continue; // skip duplicate
    }

    const category = classify(article.title, article.description ?? "");

    const { error } = await supabase.from("news").insert({
      title: article.title,
      body: article.description ?? "",
      image_url: article.urlToImage ?? null,
      url: article.url,
      category,
      date: article.publishedAt,
      published: false,
      source: "newsapi",
    });

    if (error) {
      console.error(`  ✗ Failed to insert "${article.title}":`, error.message);
    } else {
      inserted++;
    }
  }

  console.log(`✅ fetch-news: inserted ${inserted} new articles`);

  return new Response(
    JSON.stringify({ success: true, fetched: unique.length, inserted }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// ── Netlify scheduled function config ────────────────────────────────────────
export const config: Config = {
  schedule: "0 8 * * *",
};
