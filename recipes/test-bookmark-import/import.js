const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importBookmarks(filePath) {
  const html = fs.readFileSync(filePath, "utf-8");
  const bookmarks = parseBookmarkHtml(html);

  for (const bm of bookmarks) {
    await supabase.from("thoughts").insert({
      body: `Bookmark: ${bm.title}`,
      bookmark_url: bm.url,
      bookmark_folder: bm.folder,
    });
  }

  console.log(`Imported ${bookmarks.length} bookmarks.`);
}

function parseBookmarkHtml(html) {
  // Simplified parser — extracts <A> tags with HREF
  const regex = /<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
  const results = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push({ url: match[1], title: match[2], folder: "Imported" });
  }
  return results;
}

const file = process.argv.find((a) => a.startsWith("--file="))?.split("=")[1]
  || process.argv[process.argv.indexOf("--file") + 1];

importBookmarks(file);
