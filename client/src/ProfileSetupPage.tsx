import { useEffect, useState } from 'react';
import { Sport } from './models/Sport';

const ProfileSetupPage = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport>();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //TODO: use efect to set the original user values

  // useEffect(() => {
  //   fetch("http://localhost:3000/users/profile-settings")
  //     .then(res => res.json())
  //     .then(data => 
  //       console.log('current settings', data)
  //       // TODO: set form based on result here
  //     )
  //     .catch((err) => console.error("Error fetching sports:", err));
  // }, []);

  useEffect(() => {
    fetch("http://localhost:3000/sports", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Error fetching sports:", err));
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const { weight, height, experience, sport_id } = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    )
    
    try {
      const response = await fetch('http://localhost:3000/users/profile-settings', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sport_id, weight, height, experience }),
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
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Complete Your Profile</h2>
              <form onSubmit={handleSubmit}>
                <p>Sel sport {selectedSport?.name}</p>
                <div className="mb-3">
                  <label htmlFor="sport_id" className="form-label">Choose Your Sport</label>
                  <select className="form-select" name="sport_id" required>
                    <option value="">Select sport</option>
                    {sports.map((sport) => 
                      <option key={sport.id} value={sport.id} onClick={() => setSelectedSport(sport)}>{sport.name}</option>
                    )}
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
