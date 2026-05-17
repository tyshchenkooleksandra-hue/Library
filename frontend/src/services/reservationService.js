const API_URL =
  process.env.REACT_APP_API_URL;

export async function confirmReservation(
  token
) {

  const response =
    await fetch(
      `${API_URL}/api/reservation/confirm`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      'Reservation failed'
    );
  }

  return data;
}
