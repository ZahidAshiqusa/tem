import fetch from "node-fetch";

export default async function handler(req, res) {
  const { name, phone } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const owner = process.env.GITHUB_USER;

  const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEND:VCARD`;

  const file = `vcf/${Date.now()}_${name}.vcf`;

  await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Added VCF",
      content: Buffer.from(vcf).toString("base64")
    })
  });

  res.json({ ok: true });
}
