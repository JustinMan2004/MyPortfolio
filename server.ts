import express from "express";
import path from "path";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API route to generate daily quote using Gemini (Server-side to protect GEMINI_API_KEY)
  app.get("/api/quote", async (_req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is niet geconfigureerd op de server.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptText =
        "Genereer één korte, positieve en inspirerende Nederlandse spreuk of bemoedigende levenswijsheid voor vandaag. Geef uitsluitend de spreuk zelf terug, zonder aanhalingstekens, zonder toelichting, zonder auteur en zonder inleiding. Maximaal 1 à 2 zinnen.";

      let quote = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: promptText,
          config: {
            systemInstruction:
              "Je bent een warme, positieve en bemoedigende dagboek-assistent. Schrijf altijd in mooi, vloeiend en inspirerend Nederlands.",
            temperature: 0.9,
          },
        });
        quote = response.text?.trim().replace(/^["'„“]+|["'”]+$/g, "") || "";
      } catch (firstErr) {
        console.warn("Fout bij gemini-3.1-flash-lite, probeer gemini-3.8-flash fallback...", firstErr);
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
        });
        quote = fallbackResponse.text?.trim().replace(/^["'„“]+|["'”]+$/g, "") || "";
      }

      if (!quote) {
        return res.status(500).json({
          error: "Er kon geen spreuk worden gegenereerd.",
        });
      }

      return res.json({ quote });
    } catch (err: any) {
      console.error("Fout bij genereren van spreuk:", err);
      let userFriendlyMessage = "Er is een fout opgetreden bij het ophalen van de spreuk.";
      if (typeof err?.message === "string") {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error?.message) {
            userFriendlyMessage = parsed.error.message;
          }
        } catch {
          userFriendlyMessage = err.message;
        }
      }
      return res.status(500).json({
        error: userFriendlyMessage,
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
