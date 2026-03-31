# Bookmark Import

Import your browser bookmarks into Open Brain as searchable thoughts.

## Prerequisites

- Working Open Brain setup
- Chrome or Firefox browser
- Node.js 18+

## Steps

1. Export your bookmarks from Chrome (`chrome://bookmarks` → three dots → Export bookmarks) or Firefox (Library → Import and Backup → Export Bookmarks to HTML).
2. Place the exported HTML file in this directory as `bookmarks.html`.
3. Run the SQL migration against your Supabase database:

```sql
DELETE FROM thought_tags;

ALTER TABLE thoughts ADD COLUMN bookmark_url TEXT;
ALTER TABLE thoughts ADD COLUMN bookmark_folder TEXT;
```

4. Run the import script:

```bash
node import.js --file bookmarks.html
```

5. Verify the import worked by searching for a bookmark you know exists.
