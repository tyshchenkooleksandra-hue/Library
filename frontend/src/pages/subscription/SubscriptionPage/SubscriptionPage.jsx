import {
  useEffect,
  useState
} from 'react';

import { useNavigate }
  from 'react-router-dom';

import './SubscriptionPage.css';

import {
  getCurrentSubscription,
  getSubscriptionPlans,
  createCheckoutSession
} from '../../../services/subscriptionService';

function SubscriptionPage({ user }) {

  const navigate =
    useNavigate();

  const [plans, setPlans] =
    useState([]);

  const [
    currentSubscription,
    setCurrentSubscription
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const subscription =
          await getCurrentSubscription(
            user.token
          );

        if (subscription) {

          setCurrentSubscription(
            subscription
          );

          setLoading(false);

          return;
        }

        const plansData =
          await getSubscriptionPlans();

        setPlans(plansData);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    loadData();

  }, [user]);

  const handleSubscribe =
    async planId => {

      try {

        const response =
          await createCheckoutSession(
            user.token,
            planId
          );

        window.location.href =
          response.checkoutUrl;

      } catch (error) {

        console.error(error);
      }
    };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentSubscription) {

    return (
      <div className="auth-page">

        <h2>
          Current Subscription
        </h2>

        <div className="current-subscription-card">

          <h3>
            {
              currentSubscription.planName
            }
          </h3>

          <p>
            Max books:
            {' '}
            {
              currentSubscription.maxBooks
            }
          </p>

          <p>
            Return days:
            {' '}
            {
              currentSubscription.returnDays
            }
          </p>

          <p>
            Priority delivery:
            {' '}
            {
              currentSubscription
                .priorityDelivery
                  ? 'Yes'
                  : 'No'
            }
          </p>

          <p>
            Active until:
            {' '}
            {
              new Date(
                currentSubscription.endDate
              ).toLocaleDateString()
            }
          </p>

        </div>

        <button
          className="skip-button"
          onClick={() =>
            navigate('/librarypage')
          }
        >
          Go to library
        </button>

      </div>
    );
  }

  return (
    <div className="auth-page">

      <h2>
        Select Subscription
      </h2>

      <div className="subscription-container">

        {plans.map(plan => (

          <div
            key={plan.id}
            className="current-subscription-card"
          >

            <h3>
              {plan.name}
            </h3>

            <p>
              ${plan.price} / month
            </p>

            <p>
              {plan.maxBooks}
              {' '}
              books at the same time
            </p>

            <p>
              {plan.returnDays}
              {' '}
              days return period
            </p>

            <button
              onClick={() =>
                handleSubscribe(
                  plan.id
                )
              }
            >
              Choose Plan
            </button>

          </div>
        ))}

      </div>

      <button
        className="skip-button"
        onClick={() =>
          navigate('/librarypage')
        }
      >
        Skip for now
      </button>

    </div>
  );
}

export default SubscriptionPage;
