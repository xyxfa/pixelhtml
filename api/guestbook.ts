import { sql } from "@vercel/postgres";

export default async function handler(req: any, res: any) {
    // Handle GET request
    if (req.method === "GET") {
        try {
            const { rows } = await sql`
        SELECT id, name, content, created_at as date 
        FROM guestbook_messages 
        ORDER BY created_at DESC 
        LIMIT 100;
      `;
            // Format dates properly
            const formattedRows = rows.map((r) => ({
                ...r,
                id: String(r.id),
                date: new Date(r.date).toLocaleDateString(),
            }));
            return res.status(200).json(formattedRows);
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to fetch messages" });
        }
    }

    // Handle POST request
    if (req.method === "POST") {
        const { name, content } = req.body;

        if (!name || !content || name.trim() === "" || content.trim() === "") {
            return res.status(400).json({ error: "Name and content are required" });
        }

        try {
            const result = await sql`
        INSERT INTO guestbook_messages (name, content)
        VALUES (${name.trim()}, ${content.trim()})
        RETURNING id, name, content, created_at as date;
      `;

            const newMsg = result.rows[0];
            return res.status(201).json({
                ...newMsg,
                id: String(newMsg.id),
                date: new Date(newMsg.date).toLocaleDateString(),
            });
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to save message" });
        }
    }

    // Handle other methods
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
