import apiClient
  from "../api/apiClient";

export async function confirmReservation() {

  try {

    const response =
      await apiClient.post(
        "/api/reservation/confirm"
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Reservation failed"
    );
  }
}