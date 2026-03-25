"use client";

export default function StatsCards() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ padding: "20px", background: "#111", borderRadius: "10px" }}>
        Leads: 120
      </div>
      <div style={{ padding: "20px", background: "#111", borderRadius: "10px" }}>
        Revenue: ₹25,000
      </div>
      <div style={{ padding: "20px", background: "#111", borderRadius: "10px" }}>
        Conversion: 32%
      </div>
    </div>
  );
}