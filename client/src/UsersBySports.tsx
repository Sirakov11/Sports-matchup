import { FC, useEffect, useState } from "react";

interface User {
  name: string;
  sport_name: string;
}

interface UsersBySportPageProps {
  sportId: number;
  sportName: string;
}

const UsersBySportPage: FC<UsersBySportPageProps> = ({ sportId, sportName }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/sport/${sportId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Error fetching users");
      }
    };

    fetchUsers();
  }, [sportId]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Users Practicing {sportName}</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!error && users.length === 0 && <p className="text-center">No users found for this sport.</p>}
      <ul className="list-group">
        {users.map((user, index) => (
          <li key={index} className="list-group-item">
            {user.name} - {user.sport_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersBySportPage;
