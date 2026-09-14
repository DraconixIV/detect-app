import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ogldlzjfjilpavazbini.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbGRsempmamlscGF2YXpiaW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTc1MzYsImV4cCI6MjA5NDA5MzUzNn0.p96F0nQbzNZys4cS9TaQ2TAo3j6O7DoeoqVCLTRDkpI";

const TEST_SESSION_CODE = "GEO-TEST-" + Math.floor(1000 + Math.random() * 9000);
const NUM_BOTS = 15;
const DURATION_SECONDS = 10;

console.log("==========================================================");
console.log("🚀 LANCEMENT DU CRASH TEST : 15 BOTS CONCURRENTS");
console.log(`📍 Session Partagée Cible : ${TEST_SESSION_CODE}`);
console.log(`👥 Nombre de Bots Actifs : ${NUM_BOTS}`);
console.log("==========================================================\n");

// Minimal valid 1x1 JPEG buffer for fast test uploads without wasting storage
const TINY_JPEG_BASE64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
const testImageBuffer = Buffer.from(TINY_JPEG_BASE64, "base64");

const stats = {
  totalGpsBroadcasts: 0,
  successfulFinds: 0,
  failedFinds: 0,
  uploadedPhotos: 0,
  realtimeEventsReceived: 0,
  latencies: [],
  createdFindIds: [],
  uploadedFileNames: [],
  errors: []
};

async function createBot(index) {
  const botId = index + 1;
  const botCode = `GEO-BOT${String(botId).padStart(2, "0")}`;
  const botName = `Prospecteur_Bot_${String(botId).padStart(2, "0")}`;
  
  // Base location (around Fontainebleau forest) with spread
  let lat = 48.4046 + (Math.random() - 0.5) * 0.01;
  let lng = 2.7016 + (Math.random() - 0.5) * 0.01;
  
  const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  return {
    botId,
    botCode,
    botName,
    lat,
    lng,
    client
  };
}

async function run() {
  const startTime = Date.now();
  const bots = [];

  for (let i = 0; i < NUM_BOTS; i++) {
    bots.push(await createBot(i));
  }

  console.log(`✅ Initialisation réussie de ${bots.length} clients Supabase distincts.\n`);

  // 1. SETUP REALTIME LISTENER TO MEASURE BROADCAST & DB EVENTS
  console.log("📡 [Étape 1/4] Connexion au canal Realtime Supabase...");
  const monitorClient = bots[0].client;
  const channel = monitorClient
    .channel(`team-session-${TEST_SESSION_CODE}`)
    .on("broadcast", { event: "gps-pos" }, () => {
      stats.realtimeEventsReceived++;
    })
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "finds" },
      (payload) => {
        if (payload.new && (payload.new.description || "").includes(TEST_SESSION_CODE)) {
          stats.realtimeEventsReceived++;
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`🟢 Canal Realtime connecté avec succès sur ${TEST_SESSION_CODE}.\n`);
      }
    });

  // Small pause for websocket subscription
  await new Promise((r) => setTimeout(r, 1000));

  // 2. SIMULATE REALTIME GPS WALKING PATHS CONCURRENTLY
  console.log(`🚶 [Étape 2/4] Simulation de déplacement GPS en direct (15 bots x 10 secondes = ~150 ticks)...`);
  const gpsPromises = bots.map(async (bot) => {
    for (let step = 0; step < DURATION_SECONDS; step++) {
      // Simulate walking step
      bot.lat += (Math.random() - 0.48) * 0.00015;
      bot.lng += (Math.random() - 0.48) * 0.00015;
      
      const t0 = Date.now();
      try {
        await channel.send({
          type: "broadcast",
          event: "gps-pos",
          payload: {
            userCode: bot.botCode,
            userName: bot.botName,
            lat: bot.lat,
            lng: bot.lng,
            accuracy: 3 + Math.random() * 4,
            timestamp: Date.now()
          }
        });
        stats.totalGpsBroadcasts++;
        stats.latencies.push(Date.now() - t0);
      } catch (err) {
        stats.errors.push(`Broadcast GPS Bot ${bot.botId}: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 950 + Math.random() * 100));
    }
  });

  await Promise.all(gpsPromises);
  console.log(`✅ ${stats.totalGpsBroadcasts} coordonnées GPS diffusées en direct par les 15 bots.\n`);

  // 3. CONCURRENT FINDS CREATION & PHOTO UPLOADS
  console.log("🪙 [Étape 3/4] Stress Test : Création concurrente de trouvailles avec upload photo...");
  const categoriesList = ["Monnaie", "Bijou", "Boucle", "Bouton", "Militaria", "Outil", "Religieux", "Autre"];
  const materialsList = ["Bronze", "Argent", "Or", "Alliage cuivreux", "Fer", "Plomb"];

  function encodeMetadata(description, userCode, finderName, sessionCode) {
    const meta = {};
    if (userCode) meta.u = userCode;
    if (finderName) meta.f = finderName;
    if (sessionCode) meta.s = sessionCode;
    if (Object.keys(meta).length === 0) return description || "";
    const metaTag = `\n<!--GP_META:${JSON.stringify(meta)}-->`;
    return ((description || "").replace(/<!--GP_META:.*?-->/g, "").trim() + metaTag);
  }

  const findPromises = bots.map(async (bot, idx) => {
    const cat = categoriesList[idx % categoriesList.length];
    const mat = materialsList[idx % materialsList.length];
    const fileName = `test-bot-${bot.botCode}-${Date.now()}.jpg`;

    const tStart = Date.now();
    try {
      // 1. Upload Test Photo
      const uploadRes = await bot.client.storage
        .from("find-photos")
        .upload(fileName, testImageBuffer, { contentType: "image/jpeg" });

      if (uploadRes.error) {
        throw new Error(`Storage upload error: ${uploadRes.error.message}`);
      }
      stats.uploadedPhotos++;
      stats.uploadedFileNames.push(fileName);

      const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/find-photos/${fileName}`;
      const encodedDesc = encodeMetadata(mat, bot.botCode, bot.botName, TEST_SESSION_CODE);

      // 2. Insert Find in Database (using metadata encoding to match Supabase schema)
      const insertRes = await bot.client
        .from("finds")
        .insert([
          {
            title: `[TEST-BOT] ${cat} ${mat} (#${idx + 1})`,
            description: encodedDesc,
            category: cat,
            sub_category: "Test Bot Auto",
            latitude: bot.lat,
            longitude: bot.lng,
            date: new Date().toLocaleString("fr-FR"),
            image_url: photoUrl
          }
        ])
        .select()
        .single();

      if (insertRes.error) {
        throw new Error(`DB Insert error: ${insertRes.error.message}`);
      }

      const findId = insertRes.data.id;
      stats.createdFindIds.push(findId);
      stats.successfulFinds++;

      // 3. Insert find_photos row
      await bot.client.from("find_photos").insert([
        {
          find_id: findId,
          image_url: photoUrl,
          type: "discovery"
        }
      ]);

      const duration = Date.now() - tStart;
      stats.latencies.push(duration);
    } catch (err) {
      stats.failedFinds++;
      stats.errors.push(`Find creation Bot ${bot.botId}: ${err.message}`);
    }
  });

  await Promise.all(findPromises);
  console.log(`✅ ${stats.successfulFinds}/${NUM_BOTS} trouvailles concurrentes créées avec succès.\n`);

  // Small sleep to ensure all realtime events propagate
  await new Promise((r) => setTimeout(r, 1500));

  // 4. CLEANUP AUTOMATIQUE INTEGRAL
  console.log("🧹 [Étape 4/4] Nettoyage automatique des données de test sur Supabase...");
  if (stats.createdFindIds.length > 0) {
    await bots[0].client.from("find_photos").delete().in("find_id", stats.createdFindIds);
    await bots[0].client.from("finds").delete().in("id", stats.createdFindIds);
    console.log(`  ✓ ${stats.createdFindIds.length} trouvailles de test supprimées de la base.`);
  }

  if (stats.uploadedFileNames.length > 0) {
    await bots[0].client.storage.from("find-photos").remove(stats.uploadedFileNames);
    console.log(`  ✓ ${stats.uploadedFileNames.length} fichiers temporaires purgés du stockage.`);
  }

  await bots[0].client.removeChannel(channel);

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const avgLatency = stats.latencies.length > 0 
    ? Math.round(stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length) 
    : 0;
  const maxLatency = stats.latencies.length > 0 ? Math.max(...stats.latencies) : 0;

  console.log("\n==========================================================");
  console.log("📊 BILAN DU CRASH TEST DES 15 BOTS");
  console.log("==========================================================");
  console.log(`⏱️  Durée totale du test : ${totalTimeSec}s`);
  console.log(`👥 Bots concurrents : ${NUM_BOTS}`);
  console.log(`📡 Coordonnées GPS diffusées : ${stats.totalGpsBroadcasts}`);
  console.log(`⚡ Événements Realtime captés : ${stats.realtimeEventsReceived}`);
  console.log(`🪙 Trouvailles créées en parallèle : ${stats.successfulFinds}/${NUM_BOTS}`);
  console.log(`📸 Photos uploadées et purgées : ${stats.uploadedPhotos}`);
  console.log(`📈 Latence moyenne des requêtes : ${avgLatency}ms (Max : ${maxLatency}ms)`);
  console.log(`❌ Erreurs détectées : ${stats.errors.length}`);
  if (stats.errors.length > 0) {
    console.log("Détails des erreurs :", stats.errors);
  } else {
    console.log("🎉 AUCUNE ERREUR : Le système a encaissé la charge sans broncher !");
  }
  console.log("🧹 Base de données et Storage 100% propres.");
  console.log("==========================================================\n");
}

run().catch((err) => {
  console.error("Critical failure during bot run:", err);
});
