const API_URL =
  process.env.REACT_APP_API_URL;

export async function
  getCurrentSubscription(token)
{
  const response =
    await fetch(
      `${API_URL}/api/subscription/current`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      'Failed to fetch current subscription.'
    );
  }

  const data =
    await response.json();

  return data.data;
}

export async function
  createCheckoutSession(
    token,
    planId
  )
{
  const response =
    await fetch(
      `${API_URL}/api/subscription/create-checkout-session`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          planId
        })
      }
    );

  if (!response.ok) {
    throw new Error(
      'Failed to create checkout session.'
    );
  }

  return await response.json();
}

export async function
  getSubscriptionPlans()
{
  const response =
    await fetch(
      `${API_URL}/api/subscription/plans`
    );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch subscription plans.'
    );
  }

  const data =
    await response.json();

  return data.data;
}
