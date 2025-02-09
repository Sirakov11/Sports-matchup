import { FC, FormEvent } from 'react';

interface ProfileSetupPageProps {
  onProfileComplete: () => void;
}

const ProfileSetupPage: FC<ProfileSetupPageProps> = ({ onProfileComplete }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onProfileComplete(); // Redirect to Users List
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Complete Your Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight (kg)</label>
                  <input type="number" className="form-control" id="weight" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="height" className="form-label">Height (cm)</label>
                  <input type="number" className="form-control" id="height" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select className="form-select" id="experience" required>
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
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
