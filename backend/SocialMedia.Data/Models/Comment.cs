using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Microsoft.EntityFrameworkCore;

namespace SocialMedia.Data;

[AutoTimestamp]
public class Comment
{
    public Guid Id { get; set; }
    [Required]
    [MaxLength(255)]
    public string Content { get; set; }
    [Required]
    public int Likes { get; set; }

    [Required]
    public User? Author { get; set; }

    [IgnoreDataMember]
    public virtual ICollection<Comment> CommentAnswers { get; set; }
    public Comment? CommentParent { get; set; }

    public Post? PostParent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Comment(Guid id, string content)
    {
        Id = id;
        Content = content;
        Likes = 0;
        Author = null;
        CommentParent = null;
        PostParent = null;
        CommentAnswers = new List<Comment>();
    }

    internal static void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Comment>().Property(x => x.Id).AutoGenerated();
        builder.Entity<Comment>()
            .HasMany(x => x.CommentAnswers)
            .WithOne(x => x.CommentParent)
            .OnDelete(DeleteBehavior.Cascade);
    }
}