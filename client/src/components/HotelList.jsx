import { useEffect, useState } from "react";

const styles = {
  wrapper: {
    marginTop: "20px",
    backgroundColor: "#FFE0B5",
    padding: "22px",
    borderRadius: "18px",
  },
  title: {
    fontWeight: "600",
    marginBottom: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#FFF2D7",
    padding: "16px",
    borderRadius: "14px",
  },
  name: {
    fontWeight: "600",
    marginBottom: "6px",
  },
  meta: {
    fontSize: "14px",
    marginBottom: "4px",
  },
  link: {
    display: "inline-block",
    marginTop: "8px",
    color: "#3b2f2f",
    fontWeight: "600",
    textDecoration: "none",
  },
};

const HotelList = ({ destination }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination) return;

    const fetchHotels = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/hotels?city=${destination}&checkIn=2026-01-12&checkOut=2026-01-15&budget=mid`
      );
      const data = await res.json();
      setHotels(data.hotels || []);
      setLoading(false);
    };

    fetchHotels();
  }, [destination]);

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>🏨 Stay Options</h3>

      {loading && <p>Loading hotels...</p>}

      {!loading && (
        <div style={styles.grid}>
          {hotels.map((hotel, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.name}>{hotel.name}</div>
              <div style={styles.meta}>⭐ Rating: {hotel.rating}</div>
              <div style={styles.meta}>
                💰 Price/Night: {hotel.pricePerNight}
              </div>
              <div style={styles.meta}>
                📝 Reviews: {hotel.reviews}
              </div>
              <a
                href={hotel.link}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                View Hotel →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
