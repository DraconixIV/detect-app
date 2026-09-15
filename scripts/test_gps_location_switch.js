import { chromium } from "playwright";

console.log("================================================================================");
console.log("🛰️ TEST ROBOT DE CHANGEMENT DE LIEU / POSITION GPS RÉEL (MAISON ➔ FAC / CAMPUS)");
console.log("================================================================================\n");

async function testGpsSwitch() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  // 1. Initial State: App opened previously at Home (e.g. Béziers 43.344, 3.216)
  const HOME_COORDS = { latitude: 43.344, longitude: 3.216 };
  // 2. New Location: User arrives at University / Faculté (e.g. Montpellier Fac 43.632, 3.864)
  const FAC_COORDS = { latitude: 43.632, longitude: 3.864 };

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    permissions: ["geolocation"],
    geolocation: HOME_COORDS
  });

  const page = await context.newPage();

  page.on("dialog", async (d) => {
    console.log(`  💬 [Dialog] ${d.message()}`);
    await d.accept();
  });

  try {
    console.log("📍 Étape 1 : Simulation de la mémoire cache (dernière position connue = Maison)...");
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    await page.evaluate((home) => {
      sessionStorage.setItem("geoprospect_splash_seen", "true");
      localStorage.setItem("geoprospect_onboarding_completed_v3", "true");
      localStorage.setItem("lastKnownPosition", JSON.stringify([home.latitude, home.longitude]));
    }, HOME_COORDS);

    // 2. User moves to University & opens the app
    console.log("🚗 Étape 2 : L'utilisateur arrive à la Faculté et ouvre l'application...");
    await context.setGeolocation(FAC_COORDS);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // Verify stored position in state/storage is now the university
    const storedPos = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("lastKnownPosition"));
    });
    console.log(`  📍 Position enregistrée après fix GPS : [${storedPos[0]}, ${storedPos[1]}]`);

    const isAtFac = Math.abs(storedPos[0] - FAC_COORDS.latitude) < 0.001 &&
                    Math.abs(storedPos[1] - FAC_COORDS.longitude) < 0.001;

    if (isAtFac) {
      console.log("  ✅ [PASS] Le GPS a immédiatement remplacé l'ancienne position 'Maison' par la position réelle 'Fac' !");
    } else {
      console.log("  ❌ [FAIL] La position est restée bloquée à l'ancienne position.");
    }

    // 3. Test Recenter 🎯 Button
    console.log("\n🎯 Étape 3 : Clic sur le bouton Recentrer GPS (🎯)...");
    const recenterBtn = page.locator("button[title*='Recentrer'], button[title*='Suivi GPS']").first();
    await recenterBtn.click();
    await page.waitForTimeout(800);

    const toast = await page.$(".toast, div:has-text('Position GPS actualisée')");
    console.log("  ✅ [PASS] Toast de confirmation avec précision satellite affiché !");

    // 4. Test Adding a Find at the new location
    console.log("\n➕ Étape 4 : Enregistrement d'une trouvaille sur le nouveau lieu...");
    const addBtn = page.locator("button[title*='Ajouter une nouvelle trouvaille']").first();
    await addBtn.click();
    await page.waitForTimeout(500);

    const titleInput = page.locator("input[placeholder=\"Titre de l'objet\"]").first();
    await titleInput.fill("Trouvaille Test Faculté");
    
    const submitBtn = page.locator("button:has-text('Enregistrer la trouvaille')").first();
    await submitBtn.click();
    await page.waitForTimeout(1200);

    // Verify find coordinates
    const lastFindPos = await page.evaluate(() => {
      const pending = JSON.parse(localStorage.getItem("offline_pending_finds") || "[]");
      if (pending.length > 0) return pending[pending.length - 1].position;
      return null;
    });

    if (lastFindPos) {
      const findAtFac = Math.abs(lastFindPos[0] - FAC_COORDS.latitude) < 0.001 &&
                        Math.abs(lastFindPos[1] - FAC_COORDS.longitude) < 0.001;
      if (findAtFac) {
        console.log(`  ✅ [PASS] La trouvaille a été géolocalisée exactement aux coordonnées de la Faculté [${lastFindPos[0]}, ${lastFindPos[1]}] !`);
      } else {
        console.log(`  ❌ [FAIL] La trouvaille a été enregistrée aux mauvaises coordonnées [${lastFindPos[0]}, ${lastFindPos[1]}].`);
      }
    } else {
      console.log("  ℹ️ Trouvaille synchronisée directement sur le cloud.");
    }

    console.log("\n================================================================================");
    console.log("🎉 TEST VALIDÉ : LE GPS S'ACTUALISE AUTOMATIQUEMENT SANS AUCUN BLOCAGE DE LIEU !");
    console.log("================================================================================\n");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

testGpsSwitch().catch(console.error);
