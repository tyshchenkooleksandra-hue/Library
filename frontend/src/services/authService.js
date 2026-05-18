import apiClient
  from "../api/apiClient";

export async function register(data) {

  try {

    const response =
      await apiClient.post(
        "/api/auth/register",
        data
      );

    return response.data;

  } catch (error) {

    const customError =
      new Error(
        "Registration failed"
      );

    customError.data =
      error.response?.data;

    throw customError;
  }
}

export async function login(data) {

  try {

    const response =
      await apiClient.post(
        "/api/auth/login",
        data
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Login failed"
    );
  }
}