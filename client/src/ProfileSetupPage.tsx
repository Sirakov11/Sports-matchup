import { useEffect, useState } from 'react';
import { Sport } from './models/Sport';

const ProfileSetupPage = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Извличане на спортовете от сървъра
  useEffect(() => {
    fetch("http://localhost:3000/sports", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Error fetching sports:", err));
  }, []);

  // Извличане на текущите настройки на потребителя и попълване на формата
  useEffect(() => {
    fetch("http://localhost:3000/users/profile-settings", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log('current settings', data);

        if (data.sport_id) {
          setSelectedSport(sports.find(s => s.id === data.sport_id));
        }

        // Автоматично попълване на формата
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
          form.weight.value = data.weight || "";
          form.height.value = data.height || "";
          form.experience.value = data.experience || "";
          form.sport_id.value = data.sport_id || "";
          form.phone_number.value = data.phone_number || "";
        }
      })
      .catch(err => console.error("Error fetching user settings:", err));
  }, [sports]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { weight, height, experience, sport_id, phone_number } = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      const response = await fetch('http://localhost:3000/users/profile-settings', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sport_id, weight, height, experience, phone_number }),
      });

      if (response.ok) {
        setSuccess('Profile saved successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'Saving settings failed');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Saving error:', err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Complete Your Profile</h2>
              <form onSubmit={handleSubmit}>
                <p>Selected Sport: {selectedSport?.name || "None"}</p>
                <div className="mb-3">
                  <label htmlFor="sport_id" className="form-label">Choose Your Sport</label>
                  <select 
                    className="form-select" 
                    name="sport_id" 
                    required 
                    onChange={(e) => {
                      const selected = sports.find(s => s.id === Number(e.target.value));
                      setSelectedSport(selected);
                    }}
                  >
                    <option value="">Select sport</option>
                    {sports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight (kg)</label>
                  <input type="number" className="form-control" name="weight" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="height" className="form-label">Height (cm)</label>
                  <input type="number" className="form-control" name="height" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select className="form-select" name="experience" required>
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    name="phone_number" 
                    placeholder="e.g., 359888123456"
                    pattern="[0-9]+"
                  />
                  <small className="text-muted">Enter your phone number without '+' (e.g., 359888123456)</small>
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">Complete Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
