import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  sport_name?: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const sportId = localStorage.getItem("sportId"); // Вземи избрания спорт

  useEffect(() => {
    if (!sportId) return;

    fetch(`http://localhost:3000/users/sport/${sportId}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [sportId]);

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
                  <button className="btn btn-success w-100">Like</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;