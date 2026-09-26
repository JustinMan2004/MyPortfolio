import express from "express";
import path from "path";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = Number(process.env.PORT) || 3000;

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

  app.post("/api/chat", async (req, res) => {
    const { apiKey, messages } = req.body ?? {};

    if (typeof apiKey !== "string" || !apiKey.trim()) {
      return res.status(400).json({ error: "Voer eerst je Gemini API-key in." });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Stuur minstens één bericht mee." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages
          .filter(
            (message): message is { role: "user" | "model"; text: string } =>
              (message?.role === "user" || message?.role === "model") &&
              typeof message?.text === "string" &&
              message.text.trim().length > 0
          )
          .map((message) => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
        config: {
          systemInstruction:
            "Je bent een korte, behulpzame portfolio-assistent. Antwoord in het Nederlands en help met vragen over Justin zijn portfolio, projecten en AI-ontwikkeling.",
        },
      });

      const text = response.text?.trim();
      if (!text) {
        return res.status(500).json({ error: "De chatbot gaf geen antwoord." });
      }

      return res.json({ text });
    } catch (err: any) {
      console.error("Fout bij chatbot:", err);
      const providerMessage =
        typeof err?.message === "string" ? err.message : "Onbekende API-fout";
      return res.status(500).json({
        error: `Google Gemini gaf een fout: ${providerMessage}`,
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
