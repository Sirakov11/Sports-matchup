import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  sport_name?: string
  phone_number?: string
}

const MutuallyLikedPage = () => {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    fetch(`http://localhost:3000/mutuallyliked`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter out duplicate users by id
        const uniqueUsers = Array.isArray(data)
          ? data.filter(
              (user: User, index: number, self: User[]) =>
                self.findIndex((u) => u.id === user.id) === index
            )
          : [];
        setUsers(uniqueUsers);
      })
      .catch((err) => console.error("Error fetching mutual liked users:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Mutual Matches</h2>
      {users.length === 0 ? (
        <p className="text-center">You don't have any mutual matches yet.</p>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div key={user.id} className="col-md-4 mb-3">
                <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">Sport: {user.sport_name || "N/A"}</p>
                  <a 
                  href={`viber://chat?number=%2B${user.phone_number}`} 
                  className="btn btn-success w-100"
                  >
                  Chat with {user.name}
                  </a>
                </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MutuallyLikedPage
