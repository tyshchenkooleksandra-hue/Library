import { useNavigate } from 'react-router-dom';

function CheckEmailPage() {

  const navigate = useNavigate();

  return (
    <div className="auth-page">

      <h2>Confirm Your Email</h2>

      <p>
        We sent a confirmation link to your email.
      </p>

      <p>
        Please check your inbox and confirm your account.
      </p>

      <button
        onClick={() => navigate('/login')}
      >
        Back to Login
      </button>

    </div>
  );
}

export default CheckEmailPage;

