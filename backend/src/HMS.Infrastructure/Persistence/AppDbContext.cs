using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using HMS.Domain.Entities;
using HMS.Domain.Enums;

namespace HMS.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AppointmentReminder> AppointmentReminders { get; set; }
    public DbSet<EmergencyContact> EmergencyContacts { get; set; }
    public DbSet<Attender> Attenders { get; set; }
    public DbSet<Referral> Referrals { get; set; }
    public DbSet<Billing> Billings { get; set; }
    public DbSet<BillingItem> BillingItems { get; set; }
    public DbSet<RevenueRate> RevenueRates { get; set; }
    public DbSet<DoctorServiceRate> DoctorServiceRates { get; set; }
    public DbSet<HospitalSettings> HospitalSettings { get; set; }

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
                .IsRequired(false)
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

            var displayIdProperty = entity.Property(a => a.DisplayId)
                .HasColumnName("display_id")
                .UseIdentityAlwaysColumn()
                .ValueGeneratedOnAdd();
            
            // Prevent EF Core from trying to update IDENTITY ALWAYS column
            displayIdProperty.Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);

            entity.Property(a => a.AppointmentNo)
                .HasColumnName("appointment_no")
                .IsRequired();

            entity.Property(a => a.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(a => a.DoctorId)
                .HasColumnName("doctor_id");

            entity.Property(a => a.AppointmentDate)
                .HasColumnName("appointment_date")
                .HasColumnType("date");

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

            entity.Property(a => a.Department)
                .HasColumnName("department")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(a => a.Priority)
                .HasColumnName("priority")
                .HasMaxLength(20)
                .HasDefaultValue("normal")
                .IsRequired();

            entity.Property(a => a.Notes)
                .HasColumnName("notes")
                .HasDefaultValue(string.Empty)
                .IsRequired();

            entity.Property(a => a.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(a => a.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(a => a.AppointmentNo).IsUnique();
            entity.HasIndex(a => a.DisplayId).IsUnique();
            entity.HasIndex(a => new { a.DoctorId, a.AppointmentDate });
            entity.HasIndex(a => a.Status);

            // Foreign key already configured in Patient entity
        });

        modelBuilder.Entity<AppointmentReminder>(entity =>
        {
            entity.ToTable("appointment_reminders");
            entity.HasKey(reminder => reminder.Id);

            entity.Property(reminder => reminder.Id)
                .HasColumnName("id")
                .ValueGeneratedNever();

            entity.Property(reminder => reminder.AppointmentId)
                .HasColumnName("appointment_id")
                .IsRequired();

            entity.Property(reminder => reminder.Channel)
                .HasColumnName("channel")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(reminder => reminder.Timing)
                .HasColumnName("timing")
                .HasMaxLength(20)
                .IsRequired();

            entity.HasIndex(reminder => reminder.AppointmentId);

            entity.HasOne(reminder => reminder.Appointment)
                .WithMany(appointment => appointment.Reminders)
                .HasForeignKey(reminder => reminder.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Department Configuration
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("departments");
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(d => d.Name)
                .HasColumnName("name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.Description)
                .HasColumnName("description");

            entity.Property(d => d.CreatedBy)
                .HasColumnName("created_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.UpdatedBy)
                .HasColumnName("updated_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(d => d.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(d => d.Name).IsUnique();

            // Relationships
            entity.HasMany(d => d.Doctors)
                .WithOne(doc => doc.Department)
                .HasForeignKey(doc => doc.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Doctor Configuration
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.ToTable("doctors");
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(d => d.Name)
                .HasColumnName("name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.Specialization)
                .HasColumnName("specialization")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.Mobile)
                .HasColumnName("mobile")
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(d => d.DepartmentId)
                .HasColumnName("department_id")
                .IsRequired();

            entity.Property(d => d.CreatedBy)
                .HasColumnName("created_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.UpdatedBy)
                .HasColumnName("updated_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(d => d.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(d => d.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasIndex(d => d.Mobile).IsUnique();
            entity.HasIndex(d => d.DepartmentId);

            // Relationships
            entity.HasMany(d => d.Appointments)
                .WithOne(a => a.Doctor)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Billing Configuration
        modelBuilder.Entity<Billing>(entity =>
        {
            entity.ToTable("billings");
            entity.HasKey(b => b.Id);

            entity.Property(b => b.Id)
                .HasColumnName("id")
                .HasMaxLength(50)
                .ValueGeneratedOnAdd();

            entity.Property(b => b.BillNumber)
                .HasColumnName("bill_number")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(b => b.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(b => b.AppointmentId)
                .HasColumnName("appointment_id")
                .HasMaxLength(50)
                .IsRequired(false);

            entity.Property(b => b.VisitType)
                .HasColumnName("visit_type")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(b => b.DoctorId)
                .HasColumnName("doctor_id")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(b => b.Date)
                .HasColumnName("date")
                .HasColumnType("date")
                .IsRequired();

            entity.Property(b => b.Subtotal)
                .HasColumnName("subtotal")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(b => b.Discount)
                .HasColumnName("discount")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(b => b.Tax)
                .HasColumnName("tax")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(b => b.NetAmount)
                .HasColumnName("net_amount")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(b => b.PaidAmount)
                .HasColumnName("paid_amount")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(b => b.PaymentMode)
                .HasColumnName("payment_mode")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(b => b.TransactionId)
                .HasColumnName("transaction_id")
                .HasMaxLength(100)
                .IsRequired(false);

            entity.Property(b => b.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(b => b.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(b => b.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);

            entity.HasIndex(b => b.BillNumber).IsUnique();
            entity.HasIndex(b => b.PatientId);
            entity.HasIndex(b => b.DoctorId);
            entity.HasIndex(b => b.Date);

            entity.HasOne(b => b.Patient)
                .WithMany()
                .HasForeignKey(b => b.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(b => b.Doctor)
                .WithMany()
                .HasForeignKey(b => b.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(b => b.Appointment)
                .WithMany()
                .HasForeignKey(b => b.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(b => b.Items)
                .WithOne(i => i.Billing)
                .HasForeignKey(i => i.BillingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BillingItem>(entity =>
        {
            entity.ToTable("billing_items");
            entity.HasKey(i => i.Id);

            entity.Property(i => i.Id)
                .HasColumnName("id")
                .HasMaxLength(50)
                .ValueGeneratedNever();

            entity.Property(i => i.BillingId)
                .HasColumnName("billing_id")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(i => i.ServiceName)
                .HasColumnName("service_name")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(i => i.Qty)
                .HasColumnName("qty")
                .IsRequired();

            entity.Property(i => i.Rate)
                .HasColumnName("rate")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(i => i.Amount)
                .HasColumnName("amount")
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            entity.Property(i => i.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(i => i.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(i => i.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);

            entity.HasIndex(i => i.BillingId);
        });

        // RevenueRate Configuration
        modelBuilder.Entity<RevenueRate>(entity =>
        {
            entity.ToTable("revenue_rates");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).HasColumnName("id").HasMaxLength(50);
            entity.Property(r => r.VisitType).HasColumnName("visit_type").HasMaxLength(50).IsRequired();
            entity.Property(r => r.Module).HasColumnName("module").HasMaxLength(10).HasDefaultValue("OPD").IsRequired();
            entity.Property(r => r.ServiceCode).HasColumnName("service_code").HasMaxLength(255).HasDefaultValue("").IsRequired();
            entity.Property(r => r.DisplayName).HasColumnName("display_name").HasMaxLength(500).HasDefaultValue("").IsRequired();
            entity.Property(r => r.IsActive).HasColumnName("is_active").HasDefaultValue(true).IsRequired();
            entity.Property(r => r.Rate).HasColumnName("rate").HasColumnType("numeric(12,2)").IsRequired();
            entity.Property(r => r.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(r => r.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
            entity.Property(r => r.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
            entity.HasIndex(r => r.VisitType).IsUnique();
        });

        // HospitalSettings Configuration
        modelBuilder.Entity<HospitalSettings>(entity =>
        {
            entity.ToTable("hospital_settings");
            entity.HasKey(h => h.Id);

            entity.Property(h => h.Id)
                .HasColumnName("id")
                .HasMaxLength(50);

            entity.Property(h => h.HospitalName)
                .HasColumnName("hospital_name")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(h => h.AddressLine1).HasColumnName("address_line1").HasMaxLength(300);
            entity.Property(h => h.AddressLine2).HasColumnName("address_line2").HasMaxLength(300);
            entity.Property(h => h.City).HasColumnName("city").HasMaxLength(120);
            entity.Property(h => h.State).HasColumnName("state").HasMaxLength(120);
            entity.Property(h => h.PostalCode).HasColumnName("postal_code").HasMaxLength(20);
            entity.Property(h => h.Country).HasColumnName("country").HasMaxLength(120);
            entity.Property(h => h.PhoneNumber).HasColumnName("phone_number").HasMaxLength(30);
            entity.Property(h => h.AlternatePhoneNumber).HasColumnName("alternate_phone_number").HasMaxLength(30);
            entity.Property(h => h.Email).HasColumnName("email").HasMaxLength(160);
            entity.Property(h => h.Website).HasColumnName("website").HasMaxLength(160);
            entity.Property(h => h.GstNumber).HasColumnName("gst_number").HasMaxLength(60);
            entity.Property(h => h.RegistrationNumber).HasColumnName("registration_number").HasMaxLength(100);
            entity.Property(h => h.ReportHeaderTagline).HasColumnName("report_header_tagline").HasMaxLength(200);
            entity.Property(h => h.ReportFooterNote).HasColumnName("report_footer_note").HasMaxLength(500);
            entity.Property(h => h.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(h => h.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
            entity.Property(h => h.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        });

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(u => u.Name)
                .HasColumnName("name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(u => u.Email)
                .HasColumnName("email")
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(u => u.PasswordHash)
                .HasColumnName("password_hash")
                .IsRequired();

            entity.Property(u => u.PhoneNumber)
                .HasColumnName("phone_number")
                .HasMaxLength(30);

            entity.Property(u => u.Role)
                .HasColumnName("role")
                .IsRequired();

            entity.Property(u => u.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true)
                .IsRequired();

            entity.Property(u => u.DepartmentId)
                .HasColumnName("department_id")
                .HasMaxLength(50);

            entity.Property(u => u.ReferenceId)
                .HasColumnName("reference_id")
                .HasMaxLength(50);

            entity.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("NOW()");

            entity.Property(u => u.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("NOW()");

            entity.Property(u => u.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);

            // Unique constraint on Email
            entity.HasIndex(u => u.Email).IsUnique();

            // Indexes for frequently queried columns
            entity.HasIndex(u => u.Role);
            entity.HasIndex(u => u.IsActive);
        });

        // DoctorServiceRate Configuration
        modelBuilder.Entity<DoctorServiceRate>(entity =>
        {
            entity.ToTable("doctor_service_rates");
            entity.HasKey(dsr => dsr.Id);

            entity.Property(dsr => dsr.Id)
                .HasColumnName("id")
                .HasMaxLength(50)
                .ValueGeneratedNever();

            entity.Property(dsr => dsr.DoctorId)
                .HasColumnName("doctor_id")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(dsr => dsr.ServiceName)
                .HasColumnName("service_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(dsr => dsr.ServiceDescription)
                .HasColumnName("service_description")
                .HasMaxLength(500);

            entity.Property(dsr => dsr.Rate)
                .HasColumnName("rate")
                .HasPrecision(10, 2)
                .IsRequired();

            entity.Property(dsr => dsr.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true);

            entity.Property(dsr => dsr.EffectiveFrom)
                .HasColumnName("effective_from")
                .HasColumnType("timestamp without time zone")
                .IsRequired();

            entity.Property(dsr => dsr.EffectiveTo)
                .HasColumnName("effective_to")
                .HasColumnType("timestamp without time zone");

            entity.Property(dsr => dsr.CreatedBy)
                .HasColumnName("created_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(dsr => dsr.UpdatedBy)
                .HasColumnName("updated_by")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(dsr => dsr.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("NOW()");

            entity.Property(dsr => dsr.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("NOW()");

            entity.Property(dsr => dsr.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);

            // Foreign key relationship with Doctor
            entity.HasOne(dsr => dsr.Doctor)
                .WithMany(d => d.ServiceRates)
                .HasForeignKey(dsr => dsr.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for better query performance
            entity.HasIndex(dsr => dsr.DoctorId);
            entity.HasIndex(dsr => dsr.ServiceName);
            entity.HasIndex(dsr => new { dsr.DoctorId, dsr.ServiceName });
            entity.HasIndex(dsr => dsr.IsActive);
        });
    }
}
