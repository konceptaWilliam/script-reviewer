'use client'

type Props = {
  onClose: () => void
}

export default function TipsModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel tips-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Tips — Manusformat</div>
          <button className="tips-close-btn" onClick={onClose} aria-label="Stäng">✕</button>
        </div>

        <div className="tips-content">

          <div className="tips-section">
            <div className="tips-section-title">Repliker</div>
            <p className="tips-desc">Skriv varje persons replik på en ny rad med NAMN i versaler följt av kolon.</p>
            <pre className="tips-example">{`ANNA: Hej! Jag söker sommarjobbare som vill lära sig hela branschen.
MARCUS: Det bästa med jobbet är att man aldrig vet vad dagen bjuder.`}</pre>
          </div>

          <div className="tips-section">
            <div className="tips-section-title">Scenanvisningar</div>
            <p className="tips-desc">Skriv regi- och bildanvisningar inom hakparenteser. Dessa syns inte i talet men hjälper filmare och granskare att förstå kontexten.</p>
            <pre className="tips-example">{`[Anna vänder sig mot kameran och ler]
[Klipp till exteriör av kontoret, dagtid]
[Närbild på händer som skriver vid ett skrivbord]`}</pre>
          </div>

          <div className="tips-section">
            <div className="tips-section-title">Scenbyte</div>
            <p className="tips-desc">Markera tydliga scenbyten med tre bindestreck och scennamn.</p>
            <pre className="tips-example">{`--- SCEN 1: RECEPTION, MORGON ---
[Kamera sveper över receptionen]
ANNA: Välkommen till oss!

--- SCEN 2: UTOMHUS VID INGÅNGEN ---
[Solen lyser, folk rör sig i bakgrunden]`}</pre>
          </div>

          <div className="tips-section">
            <div className="tips-section-title">Voice-over (VO)</div>
            <p className="tips-desc">Text som läses in i bild utan att personen syns på skärmen markeras med VO.</p>
            <pre className="tips-example">{`VO: Vi söker dig som brinner för service och möten med människor.
VO: Ansök senast 15 juni på vår hemsida.`}</pre>
          </div>

          <div className="tips-section">
            <div className="tips-section-title">B-roll</div>
            <p className="tips-desc">B-roll är stödbilder utan dialog. Skriv dem tydligt inom hakparenteser.</p>
            <pre className="tips-example">{`[B-ROLL: Medarbetare i rörelse längs kontorets korridor]
[B-ROLL: Pausrum med folk som skrattar och fikar]
[B-ROLL: Logotyp på fasad, soligt väder]`}</pre>
          </div>

          <div className="tips-section">
            <div className="tips-section-title">Ungefärlig längd i ord</div>
            <div className="tips-length-grid">
              <div className="tips-length-row">
                <span className="tips-length-time">30 sek</span>
                <span className="tips-length-words">≈ 75–80 ord</span>
              </div>
              <div className="tips-length-row">
                <span className="tips-length-time">60 sek</span>
                <span className="tips-length-words">≈ 150–160 ord</span>
              </div>
              <div className="tips-length-row">
                <span className="tips-length-time">90 sek</span>
                <span className="tips-length-words">≈ 220–240 ord</span>
              </div>
            </div>
          </div>

          <div className="tips-section tips-section-last">
            <div className="tips-section-title">Kom ihåg</div>
            <ul className="tips-list">
              <li>Börja med en krok — de första 3 sekunderna avgör om tittaren stannar kvar.</li>
              <li>Avsluta alltid med en tydlig uppmaning: <em>Ansök idag, Skanna QR-koden, Besök oss på…</em></li>
              <li>Håll språket konversationellt — skriv som man pratar, inte som man skriver.</li>
              <li>En ny rad per tanke gör manuset lättare att läsa in.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
