using Microsoft.EntityFrameworkCore;
using HMS.Domain.Entities;

namespace HMS.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Patient Configuration
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.UHID).IsRequired();
            entity.HasIndex(p => p.UHID).IsUnique();
            entity.HasIndex(p => p.Mobile);
            entity.Property(p => p.FirstName).IsRequired();
            entity.Property(p => p.LastName).IsRequired();
            entity.Property(p => p.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(p => p.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Appointment Configuration
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.AppointmentNo).IsRequired();
            entity.HasIndex(a => a.AppointmentNo).IsUnique();
            entity.Property(a => a.Status).HasDefaultValue("Scheduled");
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(a => a.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(a => new { a.DoctorId, a.AppointmentDate });
            entity.HasIndex(a => a.Status);

            entity.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
