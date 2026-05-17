namespace Library.DataAccess.Entities
{
    public class Reservation
    {
        public int Id { get; set; }

        public string UserId { get; set; } =
            string.Empty;

        public int BookId { get; set; }

        public DateTime ReservedAt { get; set; } =
            DateTime.UtcNow;

        public DateTime ExpirationDate { get; set; }

        public string Status { get; set; } =
            "Active";

        public ApplicationUser User { get; set; } =
            null!;

        public Book Book { get; set; } =
            null!;
    }
}

