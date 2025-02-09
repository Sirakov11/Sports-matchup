import { FC, useEffect, useState } from "react";

interface Sport {
  id: number;
  name: string;
}

interface SportSelectionPageProps {
  userId: number;
  onContinue: (sportId: number) => void;
}

const SportSelectionPage: FC<SportSelectionPageProps> = ({ userId, onContinue }) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/sports")
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Error fetching sports:", err));
  }, []);

  const handleContinue = async () => {
    if (selectedSportId !== null) {
      try {
        await fetch(`http://localhost:3000/users/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sport_id: selectedSportId })
        });
        onContinue(selectedSportId);
      } catch (err) {
        console.error("Error saving sport selection:", err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose Your Sport</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {sports.map((sport) => (
          <div key={sport.id} className="col">
            <div
              className={`card sport-card h-100 ${selectedSportId === sport.id ? "selected" : ""}`}
              onClick={() => setSelectedSportId(sport.id)}
            >
              <div className="card-body">
                <h5 className="card-title">{sport.name}</h5>
                <p className="card-text">Find {sport.name.toLowerCase()} partners for matches and practice.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          disabled={!selectedSportId}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SportSelectionPage;
