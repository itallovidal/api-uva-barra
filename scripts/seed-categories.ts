// import { initFirebase } from "@/lib/firebase";
// import { validateEnv } from "@/validation/env";

// const CATEGORIES = [
//   { name: "Cultura & Artes", tags: [] },
//   { name: "Ciência & Tecnologia", tags: [] },
//   { name: "Educação & Profissão", tags: [] },
//   { name: "Sociedade & Comportamento", tags: [] },
//   { name: "Saúde & Bem-estar", tags: [] },
//   { name: "Política & Economia", tags: [] },
//   { name: "Esporte & Lazer", tags: [] },
//   { name: "Gastronomia & Moda", tags: [] },
//   { name: "Ambiente & Sustentabilidade", tags: [] },
//   { name: "Institucional & Eventos", tags: [] },
//   { name: "Rádio UVA Barra", tags: [] },
// ];

// const COLLECTION = "categories";

// async function main() {
//   const env = validateEnv(process.env);
//   const db = initFirebase(env);

//   const batch = db.batch();
//   const collection = db.collection(COLLECTION);

//   for (const cat of CATEGORIES) {
//     const id = crypto.randomUUID();
//     const docRef = collection.doc(id);
//     batch.set(docRef, { id, name: cat.name, tags: cat.tags });
//   }

//   await batch.commit();
//   console.log(`Seeded ${CATEGORIES.length} categories successfully.`);
// }

// main().catch((err) => {
//   console.error("Seed failed:", err);
//   process.exitCode = 1;
// });
