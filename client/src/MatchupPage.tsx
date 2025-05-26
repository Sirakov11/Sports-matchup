import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  sport_name?: string;
}

const MatchupPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/matchup`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleLike = async (userId: number) => {
    try {
      const response = await fetch("http://localhost:3000/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ likedId: userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Like successful!"); 
      

    } catch (error) {
      console.error("Error liking user:", error);
      alert("Failed to like user. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Find Your Opponents</h2>
      {users.length === 0 ? (
        <p className="text-center">No users found for this sport.</p>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div key={user.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">Sport: {user.sport_name || "N/A"}</p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleLike(user.id)}
                  >Like</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center mt-4">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/mutuallyliked')}
        >
          View Mutually Liked
        </button>
      </div>
    </div>
  );
};

export default MatchupPage;