// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { TravelContext } from "../context/TravelContext";

// const styles = {
//   page: {
//     minHeight: "100vh",
//     backgroundColor: "#FFF2D7",
//     padding: "30px",
//   },
//   title: {
//     fontSize: "32px",
//     marginBottom: "20px",
//     fontWeight: "700",
//   },

//   /* Cards */
//   card: {
//     backgroundColor: "#FFE0B5",
//     padding: "22px",
//     borderRadius: "18px",
//     marginBottom: "20px",
//   },

//   /* Form */
//   formTitle: {
//     fontWeight: "600",
//     marginBottom: "14px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: "14px",
//     marginBottom: "16px",
//   },
//   input: {
//     padding: "10px 12px",
//     borderRadius: "10px",
//     border: "none",
//     outline: "none",
//   },
//   button: {
//     padding: "12px 20px",
//     borderRadius: "12px",
//     border: "none",
//     backgroundColor: "#3b2f2f",
//     color: "white",
//     cursor: "pointer",
//     fontWeight: "600",
//   },

//   /* Overview */
//   location: {
//     fontWeight: "600",
//     marginBottom: "6px",
//   },
//   recommendation: {
//     marginTop: "8px",
//     fontWeight: "500",
//   },

//   /* Agent cards */
//   cardRow: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//     gap: "16px",
//   },
//   agentCard: {
//     backgroundColor: "#F8C794",
//     padding: "16px",
//     borderRadius: "16px",
//   },
//   mutedCard: {
//     backgroundColor: "#D8AE7E",
//     padding: "16px",
//     borderRadius: "16px",
//   },
// };

// const TravelPlanner = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     from: "",
//     destination: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);
  

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
  
//   // ONLY destination is sent (weather agent requirement)
//   const fetchPlan = async () => {
//     if (!form.destination) return;
//     setLoading(true);

//     const res = await fetch(
//       `http://localhost:4000/api/planner?city=${form.destination}`
//     );
//     const data = await res.json();
//     setPlan(data);

//     setLoading(false);
//   };
//   const handleRoutePlanner = () => {
//     if (!form.from || !form.destination) return;
//     navigate("/routeplanner", { state: { from: form.from, destination: form.destination } });
//   };

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.title}>Travel Planner</h1>

//       {/* PLAN TRIP */}
//       <div style={styles.card}>
//         <h3 style={styles.formTitle}>Plan your trip ✈️</h3>

//         <div style={styles.grid}>
//           <input
//             style={styles.input}
//             placeholder="Start Location"
//             name="from"
//             onChange={handleChange}
//           />
//           <input
//             style={styles.input}
//             placeholder="Destination"
//             name="destination"
//             onChange={handleChange}
//           />
//           <input
//             type="date"
//             style={styles.input}
//             name="startDate"
//             onChange={handleChange}
//           />
//           <input
//             type="date"
//             style={styles.input}
//             name="endDate"
//             onChange={handleChange}
//           />
//         </div>

//         <button style={styles.button} onClick={fetchPlan}>
//           {loading ? "Planning..." : "Generate Plan"}
//         </button>
//       </div>

//       {/* OVERVIEW */}
//       {plan && (
//         <div style={styles.card}>
//           <h3 style={styles.location}>📍 {plan.destination}</h3>
//           <p style={styles.recommendation}>
//             ❄️ {plan.recommendation}
//           </p>
//         </div>
//       )}

//       {/* AGENT OUTPUTS */}
//       {plan && (
//         <div style={styles.cardRow}>
//           {/* Weather */}
//           <div style={styles.agentCard}>
//             <h4>🌦 Weather</h4>
//             <p>Temp: {plan.weather.temperature}°C</p>
//             <p>Feels like: {plan.weather.feelsLike}°C</p>
//             <p>Humidity: {plan.weather.humidity}%</p>
//             <p>Condition: {plan.weather.condition}</p>
//           </div>

//           {/* Routes */}
//           <div style={styles.mutedCard}>
//             <h4>🛣 Routes</h4>
//             <p>Module in progress 🚧</p>
//           </div>

//           {/* Events */}
//           <div style={styles.mutedCard}>
//             <h4>🎉 Events</h4>
//             <p>Module in progress 🚧</p>
//           </div>
//         </div>
//       )}

//             <button style={styles.button} onClick={handleRoutePlanner}>
//         Go to Route Planner
//       </button>


//     </div>
//   );
// };

// export default TravelPlanner;


import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TravelContext } from "../context/TravelContext";

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#FFF2D7", padding: "30px" },
  title: { fontSize: "32px", marginBottom: "20px", fontWeight: "700" },
  card: { backgroundColor: "#FFE0B5", padding: "22px", borderRadius: "18px", marginBottom: "20px" },
  formTitle: { fontWeight: "600", marginBottom: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "16px" },
  input: { padding: "10px 12px", borderRadius: "10px", border: "none", outline: "none" },
  button: { padding: "12px 20px", borderRadius: "12px", border: "none", backgroundColor: "#3b2f2f", color: "white", cursor: "pointer", fontWeight: "600" },
  location: { fontWeight: "600", marginBottom: "6px" },
  recommendation: { marginTop: "8px", fontWeight: "500" },
  cardRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
  agentCard: { backgroundColor: "#F8C794", padding: "16px", borderRadius: "16px" },
  mutedCard: { backgroundColor: "#D8AE7E", padding: "16px", borderRadius: "16px" },
};

const TravelPlanner = () => {
  const navigate = useNavigate();
  const { setTravelData } = useContext(TravelContext); // use context

  const [form, setForm] = useState({ from: "", destination: "", startDate: "", endDate: "" });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchPlan = async () => {
    if (!form.destination) return;
    setLoading(true);
    const res = await fetch(`http://localhost:4000/api/planner?city=${form.destination}`);
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  const handleRoutePlanner = () => {
    if (!form.from || !form.destination) return;
    // Save data in context
    setTravelData({ from: form.from, destination: form.destination });
    navigate("/routePlanner"); // navigate to route planner
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Travel Planner</h1>

      {/* PLAN TRIP */}
      <div style={styles.card}>
        <h3 style={styles.formTitle}>Plan your trip ✈️</h3>

        <div style={styles.grid}>
          <input style={styles.input} placeholder="Start Location" name="from" onChange={handleChange} />
          <input style={styles.input} placeholder="Destination" name="destination" onChange={handleChange} />
          <input type="date" style={styles.input} name="startDate" onChange={handleChange} />
          <input type="date" style={styles.input} name="endDate" onChange={handleChange} />
        </div>

        <button style={styles.button} onClick={fetchPlan}>
          {loading ? "Planning..." : "Generate Plan"}
        </button>
      </div>

      {/* OVERVIEW */}
      {plan && (
        <div style={styles.card}>
          <h3 style={styles.location}>📍 {plan.destination}</h3>
          <p style={styles.recommendation}>❄️ {plan.recommendation}</p>
        </div>
      )}

      {/* AGENT OUTPUTS */}
      {plan && (
        <div style={styles.cardRow}>
          <div style={styles.agentCard}>
            <h4>🌦 Weather</h4>
            <p>Temp: {plan.weather.temperature}°C</p>
            <p>Feels like: {plan.weather.feelsLike}°C</p>
            <p>Humidity: {plan.weather.humidity}%</p>
            <p>Condition: {plan.weather.condition}</p>
          </div>

          <div style={styles.mutedCard}>
            <h4>🛣 Routes</h4>
            <p>Module in progress 🚧</p>
          </div>

          <div style={styles.mutedCard}>
            <h4>🎉 Events</h4>
            <p>Module in progress 🚧</p>
          </div>
        </div>
      )}

      <button style={styles.button} onClick={handleRoutePlanner}>
        Go to Route Planner
      </button>
    </div>
  );
};

export default TravelPlanner;
