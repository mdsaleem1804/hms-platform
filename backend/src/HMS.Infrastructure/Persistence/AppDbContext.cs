using Microsoft.EntityFrameworkCore;
using HMS.Domain.Entities;

namespace HMS.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<EmergencyContact> EmergencyContacts { get; set; }
    public DbSet<Attender> Attenders { get; set; }
    public DbSet<Referral> Referrals { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Patient Configuration
        modelBuilder.Entity<Patient>(entity =>
        {
            // Table mapping
            entity.ToTable("patients");

            // Primary key
            entity.HasKey(p => p.Id);
            
            // Property mappings - PascalCase to snake_case
            entity.Property(p => p.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(p => p.Uhid)
                .HasColumnName("uhid")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(p => p.PatientName)
                .HasColumnName("patient_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(p => p.Dob)
                .HasColumnName("dob")
                .HasColumnType("timestamp without time zone")
                .IsRequired();

            entity.Property(p => p.Gender)
                .HasColumnName("gender")
                .HasMaxLength(10);

            entity.Property(p => p.BloodGroup)
                .HasColumnName("blood_group")
                .HasMaxLength(5);

            entity.Property(p => p.Mobile)
                .HasColumnName("mobile")
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(p => p.Email)
                .HasColumnName("email")
                .HasMaxLength(100);

            entity.Property(p => p.Address)
                .HasColumnName("address");

            entity.Property(p => p.PostalCode)
                .HasColumnName("postal_code")
                .HasMaxLength(10);

            entity.Property(p => p.Photo)
                .HasColumnName("photo");

            entity.Property(p => p.IdProofType)
                .HasColumnName("id_proof_type")
                .HasMaxLength(50);

            entity.Property(p => p.IdProofNumber)
                .HasColumnName("id_proof_number")
                .HasMaxLength(100);

            entity.Property(p => p.Status)
                .HasColumnName("status")
                .HasMaxLength(20)
                .HasDefaultValue("ACTIVE");

            entity.Property(p => p.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Indexes
            entity.HasIndex(p => p.Uhid).IsUnique();
            entity.HasIndex(p => p.Mobile).IsUnique();
            entity.HasIndex(p => p.Status);

            // Relationships
            entity.HasMany(p => p.Appointments)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.EmergencyContacts)
                .WithOne(ec => ec.Patient)
                .HasForeignKey(ec => ec.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.Attenders)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.Referrals)
                .WithOne(r => r.Patient)
                .HasForeignKey(r => r.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Emergency Contact Configuration
        modelBuilder.Entity<EmergencyContact>(entity =>
        {
            entity.ToTable("emergency_contacts");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(100);

            entity.Property(e => e.Relationship)
                .HasColumnName("relationship")
                .HasMaxLength(50);

            entity.Property(e => e.ContactNumber)
                .HasColumnName("contact_number")
                .HasMaxLength(10);

            entity.HasIndex(e => e.PatientId);
        });

        // Attender Configuration
        modelBuilder.Entity<Attender>(entity =>
        {
            entity.ToTable("attenders");
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(a => a.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(a => a.Name)
                .HasColumnName("name")
                .HasMaxLength(100);

            entity.Property(a => a.Phone)
                .HasColumnName("phone")
                .HasMaxLength(10);

            entity.Property(a => a.Address)
                .HasColumnName("address");

            entity.Property(a => a.IdProofType)
                .HasColumnName("id_proof_type")
                .HasMaxLength(50);

            entity.Property(a => a.IdProofNumber)
                .HasColumnName("id_proof_number")
                .HasMaxLength(100);

            entity.HasIndex(a => a.PatientId);
        });

        // Referral Configuration
        modelBuilder.Entity<Referral>(entity =>
        {
            entity.ToTable("referrals");
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(r => r.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(r => r.Data)
                .HasColumnName("data")
                .HasColumnType("jsonb");

            entity.HasIndex(r => r.PatientId);
        });

        // Appointment Configuration
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(a => a.AppointmentNo)
                .HasColumnName("appointment_no")
                .IsRequired();

            entity.Property(a => a.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(a => a.DoctorId)
                .HasColumnName("doctor_id");

            entity.Property(a => a.AppointmentDate)
                .HasColumnName("appointment_date");

            entity.Property(a => a.StartTime)
                .HasColumnName("start_time");

            entity.Property(a => a.EndTime)
                .HasColumnName("end_time");

            entity.Property(a => a.TokenNumber)
                .HasColumnName("token_number");

            entity.Property(a => a.Status)
                .HasColumnName("status")
                .HasDefaultValue("Scheduled");

            entity.Property(a => a.VisitType)
                .HasColumnName("visit_type");

            entity.Property(a => a.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(a => a.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(a => a.AppointmentNo).IsUnique();
            entity.HasIndex(a => new { a.DoctorId, a.AppointmentDate });
            entity.HasIndex(a => a.Status);

            // Foreign key already configured in Patient entity
        });
    }
}
