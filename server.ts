// Eenvoudige server voor hosting op Render (of een andere Node-host).
// Serveert alleen de gebouwde, statische website uit de map dist/.
// Geen database, geen API-keys nodig.
import express from "express";
import path from "path";

const PORT = Number(process.env.PORT) || 3000;
const distPath = path.join(process.cwd(), "dist");

const app = express();
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio draait op http://localhost:${PORT}`);
});
