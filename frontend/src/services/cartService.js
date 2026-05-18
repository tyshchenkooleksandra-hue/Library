import apiClient
  from "../api/apiClient";

export async function addToCart(
  bookId
) {

  try {

    const response =
      await apiClient.post(
        "/api/cart/add",
        {
          bookId
        }
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Failed to add book"
    );
  }
}

export async function getCart() {

  try {

    const response =
      await apiClient.get(
        "/api/cart"
      );

    return response.data.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Failed to load cart"
    );
  }
}