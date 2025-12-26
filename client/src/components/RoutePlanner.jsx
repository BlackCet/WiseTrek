


// // // import React, { useState } from "react";
// // // import { MapContainer, TileLayer, Polyline } from "react-leaflet";
// // // import "leaflet/dist/leaflet.css";

// // // const styles = {
// // //   page: { minHeight: "100vh", backgroundColor: "#FFF2D7", padding: "30px", fontFamily: "sans-serif" },
// // //   title: { fontSize: "32px", fontWeight: "700", marginBottom: "20px" },
// // //   card: { backgroundColor: "#FFE0B5", padding: "20px", borderRadius: "16px", marginBottom: "20px" },
// // //   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
// // //   input: { padding: "10px", borderRadius: "10px", border: "1px solid #D8AE7E" },
// // //   button: { marginTop: "14px", padding: "12px", borderRadius: "12px", background: "#F8C794", border: "none", fontWeight: "600", cursor: "pointer" },
// // //   info: { fontSize: "18px", marginBottom: "6px" },
// // //   priceTag: { display: "block", background: "#fff", padding: "8px", borderRadius: "8px", marginTop: "10px", fontSize: "16px", fontWeight: "bold", border: "1px solid #D8AE7E" }
// // // };

// // // const toLatLng = (geometry) => {
// // //   if (!geometry) return [];
// // //   const coords = geometry.type === "LineString" ? geometry.coordinates : geometry.coordinates[0];
// // //   return coords.map(([lng, lat]) => [lat, lng]);
// // // };

// // // const RoutePlanner = () => {
// // //   const [form, setForm] = useState({ from: "", destination: "" });
// // //   const [drive, setDrive] = useState(null);
// // //   const [bus, setBus] = useState(null);
// // //   const [train, setTrain] = useState(null);
// // //   const [loading, setLoading] = useState(false);

// // //   const fetchRoute = async (mode) => {
// // //     const res = await fetch("http://localhost:4000/api/planner/route", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ ...form, mode }),
// // //     });
// // //     return res.json();
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setDrive(null); setBus(null); setTrain(null);

// // //     try {
// // //       const [d, b, t] = await Promise.all([
// // //         fetchRoute("drive"),
// // //         fetchRoute("bus"),
// // //         fetchRoute("train"),
// // //       ]);

// // //       if (d.success) setDrive(d.data);
// // //       if (b.success) setBus(b.data);
// // //       if (t.success) setTrain(t.data);
// // //     } catch {
// // //       alert("Backend connection failed");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };


// // //   const calculatePriceRange = (fares) => {
// // //   if (!Array.isArray(fares) || fares.length === 0) return "Unavailable";

// // //   const prices = [];

// // //   fares.forEach((str) => {
// // //     // Match ₹90 - ₹100
// // //     const rangeMatch = str.match(/₹(\d+)\s*-\s*₹(\d+)/);
// // //     if (rangeMatch) {
// // //       prices.push(parseInt(rangeMatch[1]));
// // //       prices.push(parseInt(rangeMatch[2]));
// // //       return;
// // //     }

// // //     // Match ₹380+
// // //     const plusMatch = str.match(/₹(\d+)\+/);
// // //     if (plusMatch) {
// // //       prices.push(parseInt(plusMatch[1]));
// // //     }
// // //   });

// // //   if (prices.length === 0) return "Pricing Unavailable";

// // //   return `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`;
// // // };


// // //   const center = drive ? toLatLng(drive.geometry)[0] : [20.5937, 78.9629];

// // //   return (
// // //     <div style={styles.page}>
// // //       <h1 style={styles.title}>Route Planner</h1>

// // //       <div style={styles.card}>
// // //         <form onSubmit={handleSubmit}>
// // //           <div style={styles.grid}>
// // //             <input style={styles.input} placeholder="From" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
// // //             <input style={styles.input} placeholder="To" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
// // //           </div>
// // //           <button style={styles.button} disabled={loading}>{loading ? "Comparing..." : "Compare All Modes"}</button>
// // //         </form>
// // //       </div>

// // //       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
// // //         {drive && (
// // //           <div style={styles.card}>
// // //             <h3>🚗 Drive</h3>
// // //             <p style={styles.info}>📏 {(drive.distance / 1000).toFixed(2)} km</p>
// // //             <p style={styles.info}>⏱️ {(drive.time / 60).toFixed(0)} mins</p>
// // //           </div>
// // //         )}

// // //         {bus && (
// // //           <div style={styles.card}>
// // //             <h3>🚌 Bus</h3>
// // //             <p style={styles.info}>📏 {(bus.distance / 1000).toFixed(2)} km</p>
// // //             <p style={styles.info}>⏱️ {(bus.time / 60).toFixed(0)} mins</p>
// // //           </div>
// // //         )}

// // //         {train && (
// // //   <div style={styles.card}>
// // //     <h3>🚆 Train</h3>


// // //     <p style={styles.info}>
// // //        {train.timeText}
// // //     </p>

// // //     <div style={styles.priceTag}>
// // //       <br />
// // //       <span style={{ color: "#d35400", fontSize: "20px" }}>
// // //         {calculatePriceRange(train.fares)}
// // //       </span>
// // //     </div>

// // //     <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
// // //       *Based on IRCTC standard classes
// // //     </p>
// // //   </div>
// // // )}

// // //       </div>

// // //       {(drive || bus) && (
// // //         <div style={styles.card}>
// // //           <MapContainer center={center} zoom={7} style={{ height: "400px", borderRadius: "12px" }}>
// // //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// // //             {drive && <Polyline positions={toLatLng(drive.geometry)} pathOptions={{ color: "#3b2f2f", weight: 4 }} />}
// // //             {bus && <Polyline positions={toLatLng(bus.geometry)} pathOptions={{ color: "#F8C794", weight: 4, dashArray: "6" }} />}
// // //           </MapContainer>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default RoutePlanner;


// // import React, { useState } from "react";
// // import { MapContainer, TileLayer, Polyline } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";

// // const styles = {
// //   page: { minHeight: "100vh", backgroundColor: "#FFF2D7", padding: "30px", fontFamily: "sans-serif" },
// //   title: { fontSize: "32px", fontWeight: "700", marginBottom: "20px" },
// //   card: { backgroundColor: "#FFE0B5", padding: "20px", borderRadius: "16px", marginBottom: "20px" },
// //   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
// //   input: { padding: "10px", borderRadius: "10px", border: "1px solid #D8AE7E" },
// //   button: { marginTop: "14px", padding: "12px", borderRadius: "12px", background: "#F8C794", border: "none", fontWeight: "600", cursor: "pointer" },
// //   info: { fontSize: "18px", marginBottom: "6px" },
// //   priceTag: { display: "block", background: "#fff", padding: "8px", borderRadius: "8px", marginTop: "10px", fontSize: "16px", fontWeight: "bold", border: "1px solid #D8AE7E" }
// // };

// // const toLatLng = (geometry) => {
// //   if (!geometry) return [];
// //   const coords = geometry.type === "LineString" ? geometry.coordinates : geometry.coordinates[0];
// //   return coords.map(([lng, lat]) => [lat, lng]);
// // };

// // const RoutePlanner = () => {
// //   const [form, setForm] = useState({
// //     from: "",
// //     destination: "",
// //     startDate: "",
// //     returnDate: "",
// //   });

// //   const [drive, setDrive] = useState(null);
// //   const [bus, setBus] = useState(null);
// //   const [train, setTrain] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const fetchRoute = async (mode) => {
// //     const res = await fetch("http://localhost:4000/api/planner/route", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ ...form, mode }),
// //     });
// //     return res.json();
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setDrive(null); setBus(null); setTrain(null);

// //     try {
// //       const [d, b, t] = await Promise.all([
// //         fetchRoute("drive"),
// //         fetchRoute("bus"),
// //         fetchRoute("train"), // train receives startDate + returnDate
// //       ]);

// //       if (d.success) setDrive(d.data);
// //       if (b.success) setBus(b.data);
// //       if (t.success) setTrain(t.data);
// //     } catch {
// //       alert("Backend connection failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const calculatePriceRange = (fares) => {
// //     if (!Array.isArray(fares) || fares.length === 0) return "Unavailable";

// //     const prices = [];
// //     fares.forEach((str) => {
// //       const rangeMatch = str.match(/₹(\d+)\s*-\s*₹(\d+)/);
// //       if (rangeMatch) {
// //         prices.push(parseInt(rangeMatch[1]));
// //         prices.push(parseInt(rangeMatch[2]));
// //         return;
// //       }
// //       const plusMatch = str.match(/₹(\d+)\+/);
// //       if (plusMatch) prices.push(parseInt(plusMatch[1]));
// //     });

// //     if (prices.length === 0) return "Pricing Unavailable";
// //     return `₹${Math.min(...prices)} - ₹${Math.max(...prices)}`;
// //   };

// //   const center = drive ? toLatLng(drive.geometry)[0] : [20.5937, 78.9629];

// //   return (
// //     <div style={styles.page}>
// //       <h1 style={styles.title}>Route Planner</h1>

// //       <div style={styles.card}>
// //         <form onSubmit={handleSubmit}>
// //           <div style={styles.grid}>
// //             <input
// //               style={styles.input}
// //               placeholder="From"
// //               value={form.from}
// //               onChange={(e) => setForm({ ...form, from: e.target.value })}
// //               required
// //             />
// //             <input
// //               style={styles.input}
// //               placeholder="To"
// //               value={form.destination}
// //               onChange={(e) => setForm({ ...form, destination: e.target.value })}
// //               required
// //             />

// //             {/* NEW — Start Date */}
// //             <input
// //               type="text"
// //               style={styles.input}
// //               placeholder="Start Date (DD-MM-YYYY)"
// //               value={form.startDate}
// //               onChange={(e) => setForm({ ...form, startDate: e.target.value })}
// //               required
// //             />

// //             {/* NEW — Return Date (optional) */}
// //             <input
// //               type="text"
// //               style={styles.input}
// //               placeholder="Return Date (DD-MM-YYYY)"
// //               value={form.returnDate}
// //               onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
// //             />
// //           </div>

// //           <button style={styles.button} disabled={loading}>
// //             {loading ? "Comparing..." : "Compare All Modes"}
// //           </button>
// //         </form>
// //       </div>

// //       {/* Cards — unchanged */}
// //       {/* ... rest of your component stays same */}
      
// //       {(drive || bus) && (
// //         <div style={styles.card}>
// //           <MapContainer center={center} zoom={7} style={{ height: "400px", borderRadius: "12px" }}>
// //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// //             {drive && <Polyline positions={toLatLng(drive.geometry)} pathOptions={{ color: "#3b2f2f", weight: 4 }} />}
// //             {bus && <Polyline positions={toLatLng(bus.geometry)} pathOptions={{ dashArray: "6", weight: 4 }} />}
// //           </MapContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default RoutePlanner;

// import React, { useState } from "react";
// import { MapContainer, TileLayer, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const styles = {
//   page: { minHeight: "100vh", backgroundColor: "#FFF2D7", padding: "30px" },
//   title: { fontSize: "32px", fontWeight: "700", marginBottom: "20px" },
//   card: { backgroundColor: "#FFE0B5", padding: "20px", borderRadius: "16px", marginBottom: "20px" },
//   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
//   input: { padding: "10px", borderRadius: "10px", border: "1px solid #D8AE7E" },
//   button: { marginTop: "14px", padding: "12px", borderRadius: "12px", background: "#F8C794", border: "none", fontWeight: "600", cursor: "pointer" },
// };

// const toLatLng = (geometry) =>
//   geometry ? (geometry.type === "LineString" ? geometry.coordinates : geometry.coordinates[0]).map(([lng, lat]) => [lat, lng]) : [];

// const RoutePlanner = () => {
//   const [form, setForm] = useState({ from: "", destination: "", startDate: "", returnDate: "" });
//   const [drive, setDrive] = useState(null);
//   const [bus, setBus] = useState(null);
//   const [train, setTrain] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchRoute = async (mode) => {
//     const res = await fetch("http://localhost:4000/api/planner/route", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, mode }),
//     });
//     return res.json();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setDrive(null); setBus(null); setTrain(null);

//     try {
//       const [d, b, t] = await Promise.all([
//         fetchRoute("drive"),
//         fetchRoute("bus"),
//         fetchRoute("train"),
//       ]);

//       if (d.success) setDrive(d.data);
//       if (b.success) setBus(b.data);
//       if (t.success) setTrain(t.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const center = drive ? toLatLng(drive.geometry)[0] : [20.5937, 78.9629];

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.title}>Route Planner</h1>

//       {/* FORM */}
//       <div style={styles.card}>
//         <form onSubmit={handleSubmit}>
//           <div style={styles.grid}>
//             <input style={styles.input} placeholder="From" value={form.from}
//               onChange={(e) => setForm({ ...form, from: e.target.value })} required />
//             <input style={styles.input} placeholder="To" value={form.destination}
//               onChange={(e) => setForm({ ...form, destination: e.target.value })} required />

//             {/* Start + Return Date */}
//             <input style={styles.input} placeholder="Start Date (DD-MM-YYYY)"
//               value={form.startDate}
//               onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
//             <input style={styles.input} placeholder="Return Date (DD-MM-YYYY)"
//               value={form.returnDate}
//               onChange={(e) => setForm({ ...form, returnDate: e.target.value })} />
//           </div>

//           <button style={styles.button} disabled={loading}>
//             {loading ? "Comparing..." : "Compare All Modes"}
//           </button>
//         </form>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>

//         {/* DRIVE + BUS COMBINED */}
//         {(drive || bus) && (
//           <div style={styles.card}>
//             <h3>🚗 Drive / 🚌 Bus</h3>

//             {drive && (
//               <p>Drive — {(drive.distance / 1000).toFixed(1)} km • {(drive.time / 60).toFixed(0)} mins</p>
//             )}

//             {bus && (
//               <p>Bus — {(bus.distance / 1000).toFixed(1)} km • {(bus.time / 60).toFixed(0)} mins</p>
//             )}
//           </div>
//         )}

//         {/* TRAINS DROPDOWN */}
//         {/* {train && (
//           <div style={styles.card}>
//             <h3>🚆 Trains</h3> */}

//             {/* START TRAINS */}
//             {/* {train.startTrains?.length > 0 && (
//               <>
//                 <label>Start Trains: </label>
//                 <select style={styles.input}>
//                   {train.startTrains.map((t) => (
//                     <option key={t.trainNumber}>
//                       {t.trainName} — {t.departure} ➝ {t.arrival} — Availability: {t.availability ?? "N/A"}
//                     </option>
//                   ))}
//                 </select>
//               </>
//             )} */}

//             {/* RETURN TRAINS */}
//             {/* {train.returnTrains?.length > 0 && (
//               <>
//                 <label style={{ marginTop: "10px" }}>Return Trains: </label>
//                 <select style={styles.input}>
//                   {train.returnTrains.map((t) => (
//                     <option key={t.trainNumber}>
//                       {t.trainName} — {t.departure} ➝ {t.arrival} — Availability: {t.availability ?? "N/A"}
//                     </option>
//                   ))}
//                 </select>
//               </>
//             )} */}
//           {/* </div> */}
//         {/* )} */}

//         {/* TRAINS SECTION — CARD LIST STYLE */}
// {train && (
//   <div style={styles.card}>
//     <h3>🚆 Trains</h3>

//     {/* START TRAINS */}
//     {train.startTrains?.length > 0 && (
//       <>
//         <h4>Outbound — Start Trains</h4>

//         {train.startTrains.map((t) => (
//           <div
//             key={t.trainNumber}
//             style={{
//               background: "#fff",
//               borderRadius: "14px",
//               padding: "14px",
//               marginBottom: "10px",
//               border: "1px solid #D8AE7E",
//             }}
//           >
//             <div style={{ fontWeight: 700, fontSize: "16px" }}>
//               {t.trainName} ({t.trainNumber})
//             </div>

//             <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
//               {t.from} ➝ {t.to}
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginTop: "8px",
//                 fontSize: "13px",
//               }}
//             >
//               <div>
//                 <div style={{ fontWeight: 600 }}>Departure</div>
//                 <div style={{ fontSize: "12px" }}>{t.departure}</div>
//               </div>

//               <div>
//                 <div style={{ fontWeight: 600 }}>Arrival</div>
//                 <div style={{ fontSize: "12px" }}>{t.arrival}</div>
//               </div>

//               <div>
//                 <div style={{ fontWeight: 600 }}>Duration</div>
//                 <div style={{ fontSize: "12px" }}>{t.duration}</div>
//               </div>
//             </div>

//             <div style={{ marginTop: "10px", fontSize: "12px" }}>
//               Availability:{" "}
//               <span style={{ fontWeight: 600 }}>
//                 {t.availability ?? "N/A"}
//               </span>
//             </div>
//           </div>
//         ))}
//       </>
//     )}

//     {/* RETURN TRAINS */}
//     {train.returnTrains?.length > 0 && (
//       <>
//         <h4 style={{ marginTop: "14px" }}>Return Trains</h4>

//         {train.returnTrains.map((t) => (
//           <div
//             key={t.trainNumber}
//             style={{
//               background: "#fff",
//               borderRadius: "14px",
//               padding: "14px",
//               marginBottom: "10px",
//               border: "1px solid #D8AE7E",
//             }}
//           >
//             <div style={{ fontWeight: 700, fontSize: "16px" }}>
//               {t.trainName} ({t.trainNumber})
//             </div>

//             <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
//               {t.from} ➝ {t.to}
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginTop: "8px",
//                 fontSize: "13px",
//               }}
//             >
//               <div>
//                 <div style={{ fontWeight: 600 }}>Departure</div>
//                 <div style={{ fontSize: "12px" }}>{t.departure}</div>
//               </div>

//               <div>
//                 <div style={{ fontWeight: 600 }}>Arrival</div>
//                 <div style={{ fontSize: "12px" }}>{t.arrival}</div>
//               </div>

//               <div>
//                 <div style={{ fontWeight: 600 }}>Duration</div>
//                 <div style={{ fontSize: "12px" }}>{t.duration}</div>
//               </div>
//             </div>

//             <div style={{ marginTop: "10px", fontSize: "12px" }}>
//               Availability:{" "}
//               <span style={{ fontWeight: 600 }}>
//                 {t.availability ?? "N/A"}
//               </span>
//             </div>
//           </div>
//         ))}
//       </>
//     )}
//   </div>
// )}

//       </div>

//       {/* MAP */}
//       {(drive || bus) && (
//         <div style={styles.card}>
//           <MapContainer center={center} zoom={7} style={{ height: "420px", borderRadius: "12px" }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {drive && <Polyline positions={toLatLng(drive.geometry)} pathOptions={{ weight: 4 }} />}
//             {bus && <Polyline positions={toLatLng(bus.geometry)} pathOptions={{ weight: 4, dashArray: "6" }} />}
//           </MapContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoutePlanner;



import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const styles = {
  page: { minHeight: "100vh", background: "#FFF2D7", padding: "30px" },
  card: { background: "#FFE0B5", padding: "20px", borderRadius: "16px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  input: { padding: "10px", borderRadius: "10px", border: "1px solid #D8AE7E" },
  button: { marginTop: "14px", padding: "12px", borderRadius: "12px", background: "#F8C794", border: "none", fontWeight: 600, cursor: "pointer" },
};

const toLatLng = (g) =>
  g ? (g.type === "LineString" ? g.coordinates : g.coordinates[0]).map(([lng, lat]) => [lat, lng]) : [];

const Dropdown = ({ label, list }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 12, background: "#FFDDB8", borderRadius: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 14,
          border: "none", background: "transparent", fontWeight: 700,
          textAlign: "left", cursor: "pointer"
        }}
      >
        {label} {open ? "▲" : "▼"}
      </button>

      {open && (
        <div style={{ padding: "10px 14px" }}>
          {list?.length === 0 && <div>No trains found</div>}

          {list?.map((t, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #D8AE7E", borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{t.trainName} ({t.trainNumber})</div>
              <div style={{ fontSize: 12 }}>{t.from} ➝ {t.to}</div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12 }}>
                <span>Dep: {t.departure}</span>
                <span>Arr: {t.arrival}</span>
                <span>Dur: {t.duration}</span>
              </div>

              <div style={{ marginTop: 6, fontSize: 12 }}>
                Availability: <b>{t.availability ?? "N/A"}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function RoutePlanner() {
  const [form, setForm] = useState({ from: "", destination: "", startDate: "", returnDate: "" });
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
    } finally {
      setLoading(false);
    }
  };

  const center = drive ? toLatLng(drive.geometry)[0] : [20.59, 78.96];

  return (
    <div style={styles.page}>
      {/* FORM */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <input style={styles.input} placeholder="From" value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })} required />

            <input style={styles.input} placeholder="To" value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })} required />

            <input style={styles.input} placeholder="Start Date (DD-MM-YYYY)" value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />

            <input style={styles.input} placeholder="Return Date (DD-MM-YYYY)" value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })} />
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Comparing..." : "Compare All Modes"}
          </button>
        </form>
      </div>

      {/* HORIZONTAL LAYOUT */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        
        {/* LEFT — DRIVE / BUS */}
        <div style={{ ...styles.card, flex: 1 }}>
          <h3>🚗 Drive / 🚌 Bus</h3>

          {drive && <p>Drive — {(drive.distance / 1000).toFixed(1)} km • {(drive.time / 60).toFixed(0)} mins</p>}
          {bus && <p>Bus — {(bus.distance / 1000).toFixed(1)} km • {(bus.time / 60).toFixed(0)} mins</p>}
        </div>

        {/* RIGHT — TRAINS WITH DROPDOWNS */}
        {train && (
          <div style={{ ...styles.card, flex: 1 }}>
            <h3>🚆 Train</h3>

            <Dropdown label="Start Trains" list={train.startTrains} />
            <Dropdown label="Return Trains" list={train.returnTrains} />
          </div>
        )}
      </div>

      {/* MAP */}
      {(drive || bus) && (
        <div style={{ ...styles.card, marginTop: 20 }}>
          <MapContainer center={center} zoom={7} style={{ height: 420, borderRadius: 12 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {drive && <Polyline positions={toLatLng(drive.geometry)} pathOptions={{ weight: 4 }} />}
            {bus && <Polyline positions={toLatLng(bus.geometry)} pathOptions={{ weight: 4, dashArray: "6" }} />}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
