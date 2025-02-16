import { useState } from 'react';
import { useAuth } from './auth';
import { LoginCredentials } from './auth/auth-service';

const LoginPage = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    const { name, password } = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    const credentials: LoginCredentials = {
      name: name.toString(),
      password: password.toString(),
    };

    try{
      await login(credentials);
    } catch (error){
      console.log(error);
      setError('Error logging in. Please try again');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Hello sportsman!</h2>
              {error}
              {error && 
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              }
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
