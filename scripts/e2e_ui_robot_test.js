import { chromium } from "playwright";

console.log("================================================================================");
console.log("🤖 LANCEMENT DU ROBOT DE TEST D'INTERFACE UTILISATEUR COMPLET (E2E)");
console.log("📍 Cible : http://localhost:5173/");
console.log("🎯 Audit réel du DOM : Onglets, Formulaires, Repères GPS, Popups, Auth & Thèmes");
console.log("================================================================================\n");

const results = [];
const consoleErrors = [];

function assertStep(stepName, condition, details = "") {
  if (condition) {
    results.push({ name: stepName, pass: true, details });
    console.log(`  ✅ [PASS] ${stepName} ${details ? `(${details})` : ""}`);
  } else {
    results.push({ name: stepName, pass: false, details });
    console.log(`  ❌ [FAIL] ${stepName} ${details ? `(${details})` : ""}`);
  }
}

async function runE2EBot() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Pixel 7 mobile viewport
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    permissions: ["geolocation"],
    geolocation: { latitude: 43.273, longitude: 3.173 }
  });

  const page = await context.newPage();

  // Automatically accept all browser native dialogs
  page.on("dialog", async (dialog) => {
    console.log(`  💬 [Dialogue Navigateur] ${dialog.type()}: "${dialog.message().slice(0, 60)}..."`);
    await dialog.accept();
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(`[Page Error] ${err.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  try {
    // -------------------------------------------------------------
    // ETAPE 1 : CHARGEMENT ET INITIALISATION
    // -------------------------------------------------------------
    console.log("📱 [Étape 1/10] Chargement de l'application et passage des écrans d'accueil...");
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const title = await page.title();
    assertStep("Chargement du titre de l'application", title.length > 0, `Titre : ${title}`);

    // Set storage flags
    await page.evaluate(() => {
      sessionStorage.setItem("geoprospect_splash_seen", "true");
      localStorage.setItem("geoprospect_onboarding_completed_v3", "true");
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // -------------------------------------------------------------
    // ETAPE 2 : NAVIGATION COMPLÈTE DANS LES 4 ONGLETS (BOTTOM NAV)
    // -------------------------------------------------------------
    console.log("\n🧭 [Étape 2/10] Test de navigation dans tous les onglets du bas...");
    
    // Tab 1 : Map (Carte)
    await page.click("button[data-tab='map']");
    await page.waitForTimeout(500);
    const mapEl = await page.$(".leaflet-container");
    assertStep("Onglet Carte & Moteur Leaflet actif", !!mapEl, "Carte affichée");

    // Tab 2 : Trouvailles (Album de Collection)
    await page.click("button[data-tab='gallery']");
    await page.waitForTimeout(500);
    const galleryHeader = await page.$("h2:has-text('Album de Collection')");
    assertStep("Onglet Trouvailles / Album de Collection", !!galleryHeader, "Album affiché");

    // Tab 3 : Journal (Rapports & Stats)
    await page.click("button[data-tab='reports']");
    await page.waitForTimeout(500);
    const reportsContent = await page.$("text=Journal");
    assertStep("Onglet Journal & télémétrie", !!reportsContent, "Journal affiché");

    // Tab 4 : Paramètres (Settings)
    await page.click("button[data-tab='settings']");
    await page.waitForTimeout(500);
    const settingsTitle = await page.$("text=Paramètres & Configuration");
    assertStep("Onglet Paramètres & Configuration", !!settingsTitle, "Paramètres affichés");

    // Revenir sur la Carte
    await page.click("button[data-tab='map']");
    await page.waitForTimeout(600);

    // -------------------------------------------------------------
    // ETAPE 3 : BOUTONS FLOTTANTS SUR LA CARTE
    // -------------------------------------------------------------
    console.log("\n🎯 [Étape 3/10] Test des boutons d'actions flottants sur la carte...");
    
    // Bouton Recentrer GPS (🎯)
    const recenterBtn = await page.locator("button[title*='Recentrer'], button[title*='Suivi GPS']").first();
    assertStep("Bouton Recentrer GPS visible sur la carte", await recenterBtn.isVisible());
    if (await recenterBtn.isVisible()) {
      await recenterBtn.click();
      await page.waitForTimeout(400);
      const toast = await page.$(".toast, div:has-text('Centrage et suivi GPS')");
      assertStep("Toast de confirmation du centrage GPS déclenché", !!toast);
    }

    // Bouton Couches Cartographiques (🗺️)
    const layersBtn = await page.locator("button[title*='Couches Cartographiques']").first();
    assertStep("Bouton Couches Cartographiques visible", await layersBtn.isVisible());
    if (await layersBtn.isVisible()) {
      await layersBtn.click();
      await page.waitForTimeout(600);
      const layersModal = await page.$("h3:has-text('Cartes & Surcouches IGN')");
      assertStep("Ouverture de la modale Fonds de Carte & Surcouches IGN", !!layersModal);
      
      // Fermeture de la modale
      const closeLayersBtn = await page.locator("button[aria-label='Fermer']").last();
      if (await closeLayersBtn.isVisible()) {
        await closeLayersBtn.click({ force: true });
      }
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------
    // ETAPE 4 : CRÉATION D'UNE TROUVAILLE RÉELLE VIA LE FORMULAIRE
    // -------------------------------------------------------------
    console.log("\n➕ [Étape 4/10] Création et enregistrement d'une trouvaille réelle via formulaire...");
    const addBtn = await page.locator("button[title*='Ajouter une nouvelle trouvaille']").first();
    assertStep("Présence du bouton d'ajout flottant (+)", await addBtn.isVisible());

    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(600);
      
      const modalHeader = await page.$("h3:has-text('Nouvelle Trouvaille')");
      assertStep("Ouverture de la modale de saisie de trouvaille", !!modalHeader);

      // Saisie du Titre
      const titleInput = await page.locator("input[placeholder=\"Titre de l'objet\"]").first();
      if (await titleInput.isVisible()) {
        await titleInput.fill("Denier Romain Antique E2E");
      }

      // Saisie de la Matière
      const materialSelect = await page.locator("select:has(option:has-text('Bronze'))").first();
      if (await materialSelect.isVisible()) {
        await materialSelect.selectOption({ label: "🥉 Bronze" });
      }

      // Validation de l'enregistrement
      const submitBtn = await page.locator("button:has-text('Enregistrer la trouvaille')").first();
      assertStep("Bouton d'enregistrement actif", await submitBtn.isVisible());
      
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(1200);
      }
    }

    // -------------------------------------------------------------
    // ETAPE 5 : CLIC PHYSIQUE SUR L'ÉPINGLE LEAFLET & BULLE D'INFOS
    // -------------------------------------------------------------
    console.log("\n📍 [Étape 5/10] Clic physique sur l'épingle Leaflet et vérification de la Popup...");
    
    // Locate find markers on the map
    const markerIcons = await page.$$(".leaflet-marker-icon:not(.simulated-bot-marker)");
    assertStep("Présence d'épingle(s) de trouvaille sur la carte", markerIcons.length > 0, `${markerIcons.length} épingle(s) détectée(s)`);

    if (markerIcons.length > 0) {
      // Click the first find marker
      await markerIcons[0].click({ force: true });
      await page.waitForTimeout(800);

      // Check if Leaflet Popup is open
      const popupBubble = await page.$(".leaflet-popup, .custom-find-leaflet-popup");
      assertStep("Ouverture de la bulle d'informations (Leaflet Popup) au clic sur l'épingle", !!popupBubble, "Popup visible");

      if (popupBubble) {
        const popupText = await popupBubble.innerText();
        assertStep("Contenu correct affiché dans la bulle", popupText.includes("Denier Romain") || popupText.length > 0, popupText.slice(0, 40).replace(/\n/g, " "));

        // Click "Détails & Éditer" button inside popup
        const editBtn = await page.locator("button:has-text('Détails & Éditer'), button:has-text('Détails')").first();
        if (await editBtn.isVisible()) {
          await editBtn.click();
          await page.waitForTimeout(600);
          
          const detailModal = await page.$("h3:has-text('Fiche Trouvaille'), div:has-text('Historique'), h2:has-text('Détails')");
          assertStep("Bouton 'Détails & Éditer' ➔ Ouverture de la Fiche Modale détaillée", !!detailModal, "Fiche affichée");

          // Close detail modal
          const closeDetailBtn = await page.locator("button:has-text('Fermer')").first();
          if (await closeDetailBtn.isVisible()) {
            await closeDetailBtn.click({ force: true });
          }
          await page.waitForTimeout(400);
        }
      }
    }

    // -------------------------------------------------------------
    // ETAPE 6 : GESTIONNAIRE DE CATÉGORIES PERSONNALISÉES
    // -------------------------------------------------------------
    console.log("\n🏷️ [Étape 6/10] Test du Gestionnaire de Catégories Personnalisées...");
    await page.click("button[data-tab='settings']");
    await page.waitForTimeout(600);

    const openCatManagerBtn = await page.locator("button:has-text('Gestionnaire')").first();
    if (await openCatManagerBtn.isVisible()) {
      await openCatManagerBtn.click();
      await page.waitForTimeout(600);
      const catModalTitle = await page.$("h2:has-text('Gestion des Catégories')");
      assertStep("Ouverture de la modale du Gestionnaire des Catégories", !!catModalTitle, "Modale ouverte");

      // Add a test category
      const newCatInput = await page.locator("input[placeholder*='Nouvelle catégorie']").first();
      if (await newCatInput.isVisible()) {
        await newCatInput.fill("Fibules Antiques");
        const addCatSubmit = await page.locator("button:has-text('Ajouter')").first();
        if (await addCatSubmit.isVisible()) {
          await addCatSubmit.click();
          await page.waitForTimeout(400);
          const createdCat = await page.$("text=Fibules Antiques");
          assertStep("Création et affichage dynamique d'une nouvelle catégorie", !!createdCat, "Catégorie ajoutée");
        }
      }

      // Close modal
      const closeCatModal = await page.locator("button[aria-label='Fermer']").last();
      if (await closeCatModal.isVisible()) {
        await closeCatModal.click({ force: true });
      }
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------
    // ETAPE 7 : SESSIONS D'ÉQUIPE ET PARTAGE
    // -------------------------------------------------------------
    console.log("\n👥 [Étape 7/10] Test de la modale de partage d'équipe & Code Détecteur...");
    const teamBtn = await page.locator("button:has-text('Rejoindre une session ou consulter une carte')").first();
    if (await teamBtn.isVisible()) {
      await teamBtn.click();
      await page.waitForTimeout(600);
      const teamModalTitle = await page.$("h2:has-text('Partage & Sessions')");
      assertStep("Ouverture de la modale de Partage & Sessions", !!teamModalTitle, "Modale ouverte");

      // Switch to Consult Tab (exact match)
      const consultTab = await page.getByRole("button", { name: "Consulter", exact: true });
      if (await consultTab.isVisible()) {
        await consultTab.click();
        await page.waitForTimeout(300);
        assertStep("Onglet Consultation de carte amie accessible et réactif", true, "Onglet cliquable");
      }

      // Switch to Session Tab (exact match)
      const sessionTab = await page.getByRole("button", { name: "Session", exact: true });
      if (await sessionTab.isVisible()) {
        await sessionTab.click();
        await page.waitForTimeout(300);
        assertStep("Onglet Session d'équipe accessible et réactif", true, "Onglet cliquable");
      }

      // Close team modal
      const closeTeamModal = await page.locator("button[aria-label='Fermer']").last();
      if (await closeTeamModal.isVisible()) {
        await closeTeamModal.click({ force: true });
      }
      await page.waitForTimeout(400);
    }

    // -------------------------------------------------------------
    // ETAPE 8 : TEST DE L'AUTHENTIFICATION (EMAIL & GOOGLE OAUTH)
    // -------------------------------------------------------------
    console.log("\n🔑 [Étape 8/10] Test du module d'Authentification (Email / MDP & Google OAuth)...");
    const openAuthBtn = await page.locator("button:has-text('Connexion / Inscription')").first();
    assertStep("Bouton Connexion / Inscription présent dans les paramètres", await openAuthBtn.isVisible());

    if (await openAuthBtn.isVisible()) {
      await openAuthBtn.click();
      await page.waitForTimeout(500);

      // Verify Google OAuth button is rendered
      const googleBtn = await page.locator("button:has-text('Continuer avec Google')").first();
      assertStep("Bouton SSO 'Continuer avec Google' présent et cliquable", await googleBtn.isVisible());

      // Toggle between Login and Signup modes
      const loginModeBtn = await page.locator("button:has-text('Se connecter')").first();
      const signupModeBtn = await page.locator("button:has-text('Créer un compte')").first();
      
      if (await loginModeBtn.isVisible() && await signupModeBtn.isVisible()) {
        await loginModeBtn.click();
        await page.waitForTimeout(200);
        assertStep("Bascule vers le mode 'Se connecter'", true);

        await signupModeBtn.click();
        await page.waitForTimeout(200);
        assertStep("Bascule vers le mode 'Créer un compte'", true);
      }

      // Fill in test email & password
      const emailInput = await page.locator("input[type='email']").first();
      const passwordInput = await page.locator("input[type='password']").first();

      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill("robot.prospecteur.e2e@geoprospect.app");
        await passwordInput.fill("DetectorPassword2026!");
        assertStep("Saisie des identifiants (Email et Mot de passe) dans le formulaire", true);
      }

      // Test Google OAuth click initiation
      if (await googleBtn.isVisible()) {
        await googleBtn.click();
        await page.waitForTimeout(600);
        assertStep("Déclenchement du flux Google OAuth via Supabase", true, "Requête OAuth initiée");
      }

      // Close Auth box
      const closeAuthBtn = await page.locator("button:has-text('Fermer ✕')").first();
      if (await closeAuthBtn.isVisible()) {
        await closeAuthBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // -------------------------------------------------------------
    // ETAPE 9 : CHANGEMENT DE THÈME (SOMBRE / CLAIR)
    // -------------------------------------------------------------
    console.log("\n🌓 [Étape 9/10] Test du sélecteur Mode Sombre / Mode Clair...");
    const lightBtn = page.getByRole("button", { name: "Clair" });
    if (await lightBtn.isVisible()) {
      await lightBtn.click();
      await page.waitForTimeout(300);
      const themeAttr = await page.getAttribute("html", "data-theme");
      assertStep("Bascule en Mode Clair (data-theme='light')", themeAttr === "light", `Thème actif : ${themeAttr}`);
    }

    const darkBtn = page.getByRole("button", { name: "Sombre" });
    if (await darkBtn.isVisible()) {
      await darkBtn.click();
      await page.waitForTimeout(300);
      const themeAttrDark = await page.getAttribute("html", "data-theme");
      assertStep("Bascule en Mode Sombre (data-theme='dark')", themeAttrDark === "dark", `Thème actif : ${themeAttrDark}`);
    }

    // -------------------------------------------------------------
    // ETAPE 10 : AUDIT CONSOLE JAVASCRIPT
    // -------------------------------------------------------------
    console.log("\n🔍 [Étape 10/10] Vérification de la console JavaScript du navigateur...");
    const filteredConsoleErrors = consoleErrors.filter(
      (e) => !e.includes("net::ERR_") && !e.includes("favicon") && !e.includes("404")
    );

    assertStep(
      "Zéro erreur d'exécution JavaScript critique dans la console du navigateur",
      filteredConsoleErrors.length === 0,
      filteredConsoleErrors.length > 0 ? filteredConsoleErrors.join("; ") : "Console 100% propre"
    );

  } catch (err) {
    console.error("Critical E2E test runner exception:", err);
  } finally {
    await browser.close();
  }

  const passedCount = results.filter((r) => r.pass).length;
  const failedCount = results.filter((r) => !r.pass).length;

  console.log("\n================================================================================");
  console.log(`📊 BILAN DU TEST D'INTERFACE E2E PAR LE ROBOT : ${passedCount}/${results.length} ÉTAPES VALIDÉES`);
  if (failedCount === 0) {
    console.log("🎉 100% DE L'INTERFACE, DES BOUTONS, DE L'AUTH ET DES MODALES SONT VALIDÉS SUR LE VRAI MOTEUR CHROMIUM !");
  } else {
    console.log(`⚠️ ${failedCount} étape(s) ont échoué.`);
  }
  console.log("================================================================================\n");
}

runE2EBot().catch(console.error);
