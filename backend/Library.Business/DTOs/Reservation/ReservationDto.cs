namespace Library.Business.DTOs.Reservation
{
    public class ReservationDto
    {
        public int Id { get; set; }

        public string Title { get; set; } =
            string.Empty;

        public string Author { get; set; } =
            string.Empty;

        public DateTime ReservedAt { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string Status { get; set; } =
            string.Empty;
    }
}
