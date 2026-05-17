import { useNavigate } from 'react-router-dom';

import './SubscriptionSuccessPage.css';

function SubscriptionSuccessPage() {

  const navigate = useNavigate();

  return (
    <div className="subscription-success-page">

      <div className="subscription-success-card">

        <h1>
          Payment Successful 🎉
        </h1>

        <p>
          Your subscription has been activated successfully.
        </p>

        <button
          onClick={() => navigate('/shoppage')}
        >
          Go to Shop
        </button>

      </div>

    </div>
  );
}

export default SubscriptionSuccessPage;
