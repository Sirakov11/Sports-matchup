import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  sport_name?: string
  phone_number?: string
}

const MutuallyLikedPage = () => {
  const [users, setUsers] = useState<User[]>([])

  const handleStartChat = async (userId: number) => {
    try {
      const response = await fetch("http://localhost:3000/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle chat initiation response here
      // You might want to redirect to a chat page or open a chat window

    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3000/mutuallyliked`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
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
