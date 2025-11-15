import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const owner = process.env.GITHUB_USER;

  const date = new Date();
  const file = `${date.getFullYear()}-${date.getMonth()+1}.json`;

  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;

  let existing = [];

  try {
    const r = await fetch(api, { headers: { Authorization: `token ${token}` } });
    if (r.status === 200) {
      const d = await r.json();
      const content = Buffer.from(d.content, "base64").toString();
      existing = JSON.parse(content);
    }
  } catch {}

  existing.push(req.body);

  const newContent = Buffer.from(JSON.stringify(existing, null, 2)).toString("base64");

  await fetch(api, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Updated data",
      content: newContent,
      sha: undefined
    })
  });

  res.json({ ok: true });
}
