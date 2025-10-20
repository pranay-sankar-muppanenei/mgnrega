// scripts/cleanAndMapData.js
const fs = require("fs");

// Input & Output file paths
const rawFile = "./data/mgnrega_raw.json";
const cleanFile = "./data/mgnrega.json";

// Fields we want to keep and remap for monthly performance
const mapMonthlyFields = (record) => ({
  month: record["month"] || "",
  activeJobCards: Number(record["Total_No_of_Active_Job_Cards"] || 0),
  activeWorkers: Number(record["Total_No_of_Active_Workers"] || 0),
  totalExpenditure: Number(record["Total_Exp"] || 0),
  avgWage: Number(record["Average_Wage_rate_per_day_per_person"] || 0),
  ongoingWorks: Number(record["Number_of_Ongoing_Works"] || 0),
  completedWorks: Number(record["Number_of_Completed_Works"] || 0),
  womenPersondays: Number(record["Women_Persondays"] || 0),
});

// Main clean function
const cleanData = () => {
  try {
    const raw = JSON.parse(fs.readFileSync(rawFile, "utf-8"));

    // Group by district + year
    const grouped = {};

    raw.forEach((record) => {
      const state = record["state_name"]?.trim();
      const district = record["district_name"]?.trim();
      const year = record["fin_year"]?.trim();

      if (!state || !district || !year) return;

      const key = `${district}_${year}`;

      if (!grouped[key]) {
        grouped[key] = {
          state,
          district,
          financialYear: year,
          performance: [],
        };
      }

      grouped[key].performance.push(mapMonthlyFields(record));
    });

    const cleaned = Object.values(grouped);

    fs.writeFileSync(cleanFile, JSON.stringify(cleaned, null, 2));
    console.log(`✅ Cleaned & grouped ${cleaned.length} district-year records saved to ${cleanFile}`);
  } catch (err) {
    console.error("❌ Error cleaning data:", err);
  }
};

cleanData();
