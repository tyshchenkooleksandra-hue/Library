import apiClient
  from "../api/apiClient";

export async function getBooks(
  page = 1,
  limit = 6
) {

  try {

    const response =
      await apiClient.get(
        `/api/books?page=${page}&limit=${limit}`
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Failed to load books"
    );
  }
}