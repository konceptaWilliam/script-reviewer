"use client";

import { useState } from "react";
import ChannelGrid from "@/components/ChannelGrid";
import BudgetBar from "@/components/BudgetBar";
import ResultModal from "@/components/ResultModal";
import TipsModal from "@/components/TipsModal";
import { BUDGET_CAP, CHANNELS } from "@/lib/channels";
import { getTotalCost, buildChannelLines } from "@/lib/budget";

type Message = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [manus, setManus] = useState("");
  const [manusTitle, setManusTitle] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cpcBudgets, setCpcBudgets] = useState<Record<string, string>>({});
  const [extraAmount, setExtraAmount] = useState("");
  const [extraDesc, setExtraDesc] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [awaitingFollowUp, setAwaitingFollowUp] = useState(false);
  const [followUpInput, setFollowUpInput] = useState("");
  const [showTips, setShowTips] = useState(false);

  const total = getTotalCost(selected, cpcBudgets, extraAmount);

  const canSubmit =
    manus.trim().length > 0 &&
    selected.size > 0 &&
    [...selected].every((id) => {
      const ch = CHANNELS.find((c) => c.id === id);
      if (!ch) return true;
      if (ch.fixedCost) return true;
      return parseFloat(cpcBudgets[id] || "") > 0;
    });

  function handleToggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCpcBudgets((b) => {
          const nb = { ...b };
          delete nb[id];
          return nb;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSetCpcBudget(id: string, val: string) {
    setCpcBudgets((prev) => ({ ...prev, [id]: val }));
  }

  async function callApi(messages: Message[]) {
    setLoading(true);
    setResult("");
    setAwaitingFollowUp(false);

    try {
      const response = await fetch("/api/granska", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }

      const updated: Message[] = [
        ...messages,
        { role: "assistant", content: accumulated },
      ];
      setConversation(updated);

      if (!accumulated.includes("### Score:")) {
        setAwaitingFollowUp(true);
      }
    } catch {
      setResult(
        "Något gick fel. Kontrollera att OPENAI_API_KEY är konfigurerad i .env.local och försök igen.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function granska() {
    if (!manus.trim()) return;

    const channelLines = buildChannelLines(selected, cpcBudgets);
    const extraCost = parseFloat(extraAmount) || 0;
    if (extraCost > 0) {
      channelLines.push(
        `Övrig kostnad: ${extraCost.toLocaleString("sv-SE")} kr — ${extraDesc || "ingen beskrivning angiven"}`,
      );
    }

    const userMessage = `Manus:
${manus}

Valda kanaler och budget:
${channelLines.length > 0 ? channelLines.join("\n") : "Inga kanaler valda"}

Totalt: ${total.toLocaleString("sv-SE")} kr / 20 000 kr (budgettak)

Övrig information: ${extraInfo || "Ingen"}`;

    const messages: Message[] = [{ role: "user", content: userMessage }];
    setShowResult(true);
    setConversation(messages);
    await callApi(messages);
  }

  async function sendFollowUp() {
    if (!followUpInput.trim() || loading) return;
    const messages: Message[] = [
      ...conversation,
      { role: "user", content: followUpInput },
    ];
    setFollowUpInput("");
    await callApi(messages);
  }

  return (
    <div className="wrap">
      <div className="logo-row">
        <div className="logo-dot" />
        <span className="logo-text">Koncepta · Manusgranskare</span>
      </div>

      <h1>Granska rekryteringsmanus</h1>
      <p className="subtitle">
        Klistra in manuset, välj kanaler och ange budget — granskningen visas
        direkt på sidan.
      </p>
      <button className="tips-btn" onClick={() => setShowTips(true)}>
        Hur skriver man ett bra manus? →
      </button>

      <div className="field-group">
        <div className="section-label">Manusnamn (valfritt)</div>
        <input
          type="text"
          className="ovrig-info"
          placeholder="T.ex. Sommarjobb Göteborg 2026…"
          value={manusTitle}
          onChange={(e) => setManusTitle(e.target.value)}
        />
      </div>

      <div className="field-group">
        <div className="section-label">Manus</div>
        <textarea
          placeholder="Klistra in ditt manus här..."
          value={manus}
          onChange={(e) => setManus(e.target.value)}
        />
      </div>

      <div className="field-group">
        <div className="section-label">Kanaler för annonsering</div>
        <div className="eldin-tip">
          <div className="eldin-avatar">
            <img
              src="/eldinfyrkant.png"
              alt="Eldin"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="eldin-text">
            <strong>Eldin rekommenderar:</strong> Meta Reel (bäst räckvidd),
            Meta Inlägg (lägst pris) och NA Native-annons (lokal trovärdighet)
            för rekrytering.
          </div>
        </div>
        <ChannelGrid
          selected={selected}
          cpcBudgets={cpcBudgets}
          onToggle={handleToggle}
          onSetCpcBudget={handleSetCpcBudget}
        />
      </div>

      <BudgetBar total={total} cap={BUDGET_CAP} />

      <div className="field-group">
        <div className="section-label">
          Övrig kostnad (valfritt. Betalda statister, rekvisita osv.)
        </div>
        <input
          type="number"
          className="extra-amount-input"
          placeholder="Belopp (kr)"
          value={extraAmount}
          onChange={(e) => setExtraAmount(e.target.value)}
          min="0"
        />
        <div
          className={`extra-desc-box${extraAmount && parseFloat(extraAmount) > 0 ? " visible" : ""}`}
        >
          <textarea
            className="extra-desc-textarea"
            placeholder="Beskriv vad den övriga kostnaden ska gå till…"
            value={extraDesc}
            onChange={(e) => setExtraDesc(e.target.value)}
          />
        </div>
      </div>

      <div className="field-group">
        <div className="section-label">Övrig information (valfritt)</div>
        <input
          type="text"
          className="ovrig-info"
          placeholder="Ifall ni har något att tillägga.."
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>

      <button
        className="submit-btn"
        onClick={granska}
        disabled={loading || !canSubmit}
      >
        {loading ? "Granskar…" : "Granska manus ↗"}
      </button>

      {showTips && <TipsModal onClose={() => setShowTips(false)} />}

      {showResult && (
        <ResultModal
          text={result}
          loading={loading}
          manus={manus}
          manusTitle={manusTitle}
          awaitingFollowUp={awaitingFollowUp}
          followUpInput={followUpInput}
          onFollowUpChange={setFollowUpInput}
          onSendFollowUp={sendFollowUp}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
