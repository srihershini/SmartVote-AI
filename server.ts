import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "database" for the demo
  // In a real app, this would be a secure database
  const votingState = {
    candidates: [
      { 
        id: "DJA", 
        name: { 
          English: "Digital Justice Alliance", 
          Hindi: "डिजिटल न्याय गठबंधन", 
          Telugu: "డిజిటల్ జస్టిస్ అలయన్స్", 
          Tamil: "டிஜிட்டல் நீதி கூட்டணி", 
          Marathi: "डिजिटल न्याय आघाडी", 
          Malayalam: "ഭാരതീയ ജനതാ പാർട്ടി" 
        }, 
        symbol: "📡", 
        votes: 120,
        manifesto: "Accelerating India's digital future through high-speed infrastructure and web3 transparency.",
        leader: "Aryan @TechVoter Sharma",
        voiceKeys: ["dja", "digital", "network", "satellite", "party 1"]
      },
      { 
        id: "GGU", 
        name: { 
          English: "Green Growth Union", 
          Hindi: "हरित विकास संघ", 
          Telugu: "గ్రీన్ గ్రోత్ యూనియన్", 
          Tamil: "பசுமை வளர்ச்சி ஒன்றியம்", 
          Marathi: "हरित विकास संघ", 
          Malayalam: "ഗ്രീൻ ഗ്രോത്ത് യൂണിയൻ" 
        }, 
        symbol: "🌳", 
        votes: 95,
        manifesto: "Sustainable growth with a focus on net-zero carbon and organic agriculture.",
        leader: "Isha @EcoWarrior Verma",
        voiceKeys: ["ggu", "green", "plant", "nature", "leaf", "party 2"]
      },
      { 
        id: "GPF", 
        name: { 
          English: "Global Progress Front", 
          Hindi: "वैश्विक प्रगति मोर्चा", 
          Telugu: "గ్లోబల్ ప్రోగ్రెస్ ఫ్రంట్", 
          Tamil: "உலகளாவிய முன்னேற்ற முன்னணி", 
          Marathi: "ग्लोबल प्रोग्रेस फ्रंट", 
          Malayalam: "ഗ്ലോബൽ പ്രോഗ്രസ് ഫ്രണ്ട്" 
        }, 
        symbol: "⚛️", 
        votes: 110,
        manifesto: "Scientific advancement, space exploration, and nuclear energy independent India.",
        leader: "Kabir @SpaceBound Reddy",
        voiceKeys: ["gpf", "progress", "atom", "science", "party 3"]
      },
      { 
        id: "UPP", 
        name: { 
          English: "Unified People's Party", 
          Hindi: "एकीकृत जन पार्टी", 
          Telugu: "యూనిఫైడ్ పీపుల్స్ పార్టీ", 
          Tamil: "ஐக்கிய மக்கள் கட்சி", 
          Marathi: "युनिफाइड पीपल्स पार्टी", 
          Malayalam: "യൂണിഫൈడ్ పీപ്പിൾస్ പാർട്ടി" 
        }, 
        symbol: "🔗", 
        votes: 85,
        manifesto: "Strengthening unity through social harmony and decentralised governance.",
        leader: "Zoya @UnityFirst Khan",
        voiceKeys: ["upp", "unified", "link", "chain", "unity", "party 4"]
      },
    ],
    voters: new Set(), // Set of Aadhar numbers that have voted
  };

  // Simulate real-time vote updates as requested
  // This periodically increases votes for random candidates to simulate active voting nationwide
  setInterval(() => {
    const numCandidatesToUpdate = Math.floor(Math.random() * 2) + 1; // Update 1 or 2 candidates
    for (let i = 0; i < numCandidatesToUpdate; i++) {
      const randomIndex = Math.floor(Math.random() * votingState.candidates.length);
      const increment = Math.floor(Math.random() * 4) + 1; // Add 1-4 votes
      votingState.candidates[randomIndex].votes += increment;
    }
  }, 12000); // Increased interval to 12s to reduce console noise

  // API Routes
  app.get("/api/results", (req, res) => {
    res.json({
      candidates: votingState.candidates,
      totalVotes: votingState.candidates.reduce((sum, c) => sum + c.votes, 0),
    });
  });

  app.post("/api/vote", (req, res) => {
    const { aadhar, candidateId } = req.body;

    if (!aadhar || !candidateId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (votingState.voters.has(aadhar)) {
      return res.status(403).json({ error: "Vote already cast for this Aadhar number" });
    }

    const candidate = votingState.candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.votes += 1;
    votingState.voters.add(aadhar);

    res.json({ success: true, message: "Vote cast successfully" });
  });

  app.post("/api/verify-aadhar", (req, res) => {
    const { aadhar } = req.body;
    // Simulate Aadhar validation (12 digits check)
    if (/^\d{12}$/.test(aadhar)) {
      const hasVoted = votingState.voters.has(aadhar);
      res.json({ success: true, hasVoted });
    } else {
      res.status(400).json({ error: "Invalid Aadhar number format" });
    }
  });

  app.post("/api/verify-otp", (req, res) => {
    const { aadhar, otp } = req.body;
    // Simulate OTP validation
    if (/^\d{6}$/.test(otp)) {
      if (otp === "123456") {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid OTP. Try 123456 for testing." });
      }
    } else {
      res.status(400).json({ error: "Invalid OTP format. Must be 6 digits." });
    }
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartVote-AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
