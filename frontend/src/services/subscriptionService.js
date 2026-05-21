import apiClient
  from "../api/apiClient";

export async function
  getCurrentSubscription()
{
  try {

    const response =
      await apiClient.get(
        "/api/subscription/current"
      );

    return response.data.data;

  } catch (error) {

    if (
      error.response?.status === 404
    ) {
      return null;
    }

    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch current subscription."
    );
  }
}

export async function
  createCheckoutSession(
    planId
  )
{
  try {

    const response =
      await apiClient.post(
        "/api/subscription/create-checkout-session",
        {
          planId
        }
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Failed to create checkout session."
    );
  }
}

export async function
  getSubscriptionPlans()
{
  try {

    const response =
      await apiClient.get(
        "/api/subscription/plans"
      );

    return response.data.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch subscription plans."
    );
  }
}