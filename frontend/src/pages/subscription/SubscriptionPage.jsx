import { useNavigate } from 'react-router-dom';

function SubscriptionPage() {

  const navigate = useNavigate();

  return (
    <div className="auth-page">

      <h2>Select Subscription</h2>

      <div className="subscription-container">

        <div className="subscription-card">

          <h3>Basic Plan</h3>

          <p>19 ₴ / month</p>

          <p>2 books at the same time</p>

          <p>14 days return period</p>

          <button
            onClick={() => navigate('/shoppage')}
          >
            Choose Basic
          </button>

        </div>

        <div className="subscription-card">

          <h3>Premium Plan</h3>

          <p>39 ₴ / month</p>

          <p>5 books at the same time</p>

          <p>30 days return period</p>

          <button
            onClick={() => navigate('/shoppage')}
          >
            Choose Premium
          </button>

        </div>

      </div>

      <button
        className="skip-button"
        onClick={() => navigate('/shoppage')}
      >
        Skip for now
      </button>

    </div>
  );
}

export default SubscriptionPage;
