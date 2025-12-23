


import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#FFF2D7", padding: "30px", fontFamily: "sans-serif" },
  title: { fontSize: "32px", fontWeight: "700", marginBottom: "20px" },
  card: { backgroundColor: "#FFE0B5", padding: "20px", borderRadius: "16px", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  input: { padding: "10px", borderRadius: "10px", border: "1px solid #D8AE7E" },
  button: { marginTop: "14px", padding: "12px", borderRadius: "12px", background: "#F8C794", border: "none", fontWeight: "600", cursor: "pointer" },
  info: { fontSize: "18px", marginBottom: "6px" },
  priceTag: { display: "block", background: "#fff", padding: "8px", borderRadius: "8px", marginTop: "10px", fontSize: "16px", fontWeight: "bold", border: "1px solid #D8AE7E" }
};

const toLatLng = (geometry) => {
  if (!geometry) return [];
  const coords = geometry.type === "LineString" ? geometry.coordinates : geometry.coordinates[0];
  return coords.map(([lng, lat]) => [lat, lng]);
};

const RoutePlanner = () => {
  const [form, setForm] = useState({ from: "", destination: "" });
  const [drive, setDrive] = useState(null);
  const [bus, setBus] = useState(null);
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoute = async (mode) => {
    const res = await fetch("http://localhost:4000/api/planner/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, mode }),
    });
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDrive(null); setBus(null); setTrain(null);

    try {
      const [d, b, t] = await Promise.all([
        fetchRoute("drive"),
        fetchRoute("bus"),
        fetchRoute("train"),
      ]);

      if (d.success) setDrive(d.data);
      if (b.success) setBus(b.data);
      if (t.success) setTrain(t.data);
    } catch {
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };


  const calculatePriceRange = (fares) => {
  if (!Array.isArray(fares) || fares.length === 0) return "Unavailable";

  const prices = [];

  fares.forEach((str) => {
    // Match ₹90 - ₹100
    const rangeMatch = str.match(/₹(\d+)\s*-\s*₹(\d+)/);
    if (rangeMatch) {
      prices.push(parseInt(rangeMatch[1]));
      prices.push(parseInt(rangeMatch[2]));
      return;
    }

    // Match ₹380+
    const plusMatch = str.match(/₹(\d+)\+/);
    if (plusMatch) {
      prices.push(parseInt(plusMatch[1]));
    }
  });

  if (prices.length === 0) return "Pricing Unavailable";

  return `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`;
};


  const center = drive ? toLatLng(drive.geometry)[0] : [20.5937, 78.9629];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Route Planner</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <input style={styles.input} placeholder="From" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
            <input style={styles.input} placeholder="To" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
          </div>
          <button style={styles.button} disabled={loading}>{loading ? "Comparing..." : "Compare All Modes"}</button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {drive && (
          <div style={styles.card}>
            <h3>🚗 Drive</h3>
            <p style={styles.info}>📏 {(drive.distance / 1000).toFixed(2)} km</p>
            <p style={styles.info}>⏱️ {(drive.time / 60).toFixed(0)} mins</p>
          </div>
        )}

        {bus && (
          <div style={styles.card}>
            <h3>🚌 Bus</h3>
            <p style={styles.info}>📏 {(bus.distance / 1000).toFixed(2)} km</p>
            <p style={styles.info}>⏱️ {(bus.time / 60).toFixed(0)} mins</p>
          </div>
        )}

        {train && (
  <div style={styles.card}>
    <h3>🚆 Train</h3>


    <p style={styles.info}>
       {train.timeText}
    </p>

    <div style={styles.priceTag}>
      <br />
      <span style={{ color: "#d35400", fontSize: "20px" }}>
        {calculatePriceRange(train.fares)}
      </span>
    </div>

    <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
      *Based on IRCTC standard classes
    </p>
  </div>
)}

      </div>

      {(drive || bus) && (
        <div style={styles.card}>
          <MapContainer center={center} zoom={7} style={{ height: "400px", borderRadius: "12px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {drive && <Polyline positions={toLatLng(drive.geometry)} pathOptions={{ color: "#3b2f2f", weight: 4 }} />}
            {bus && <Polyline positions={toLatLng(bus.geometry)} pathOptions={{ color: "#F8C794", weight: 4, dashArray: "6" }} />}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;