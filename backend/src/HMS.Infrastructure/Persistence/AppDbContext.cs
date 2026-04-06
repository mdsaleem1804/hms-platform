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
    public DbSet<MedicalHistory> MedicalHistories { get; set; }
    public DbSet<AdmissionDetails> AdmissionDetails { get; set; }
    public DbSet<VitalSigns> VitalSigns { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<LabReport> LabReports { get; set; }
    public DbSet<ProgressNote> ProgressNotes { get; set; }

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
                .WithMany(p => p.Billings)
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

        // Medical History Configuration
        modelBuilder.Entity<MedicalHistory>(entity =>
        {
            entity.ToTable("medical_histories");
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(m => m.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(m => m.KnownAllergies)
                .HasColumnName("known_allergies");

            entity.Property(m => m.HasDrugAllergy)
                .HasColumnName("has_drug_allergy");

            entity.Property(m => m.HasFoodAllergy)
                .HasColumnName("has_food_allergy");

            entity.Property(m => m.AllergySeverity)
                .HasColumnName("allergy_severity")
                .HasMaxLength(20);

            entity.Property(m => m.ChronicConditions)
                .HasColumnName("chronic_conditions");

            entity.Property(m => m.IsDiabetic)
                .HasColumnName("is_diabetic");

            entity.Property(m => m.IsHypertensive)
                .HasColumnName("is_hypertensive");

            entity.Property(m => m.HasHeartDisease)
                .HasColumnName("has_heart_disease");

            entity.Property(m => m.HasAsthma)
                .HasColumnName("has_asthma");

            entity.Property(m => m.HasKidneyDisease)
                .HasColumnName("has_kidney_disease");

            entity.Property(m => m.HasThyroidDisease)
                .HasColumnName("has_thyroid_disease");

            entity.Property(m => m.SurgeryDetails)
                .HasColumnName("surgery_details");

            entity.Property(m => m.FamilyHistoryOfDiabetes)
                .HasColumnName("family_history_diabetes")
                .HasMaxLength(50);

            entity.Property(m => m.FamilyHistoryOfHeartDisease)
                .HasColumnName("family_history_heart_disease")
                .HasMaxLength(50);

            entity.Property(m => m.FamilyHistoryOfCancer)
                .HasColumnName("family_history_cancer")
                .HasMaxLength(50);

            entity.Property(m => m.OtherFamilyHistory)
                .HasColumnName("other_family_history");

            entity.Property(m => m.PreviousSurgeries)
                .HasColumnName("previous_surgeries");

            entity.Property(m => m.Vaccinations)
                .HasColumnName("vaccinations");

            entity.Property(m => m.ExerciseFrequency)
                .HasColumnName("exercise_frequency")
                .HasMaxLength(20);

            entity.Property(m => m.IsSmoker)
                .HasColumnName("is_smoker");

            entity.Property(m => m.UsesAlcohol)
                .HasColumnName("uses_alcohol");

            entity.Property(m => m.PastMedications)
                .HasColumnName("past_medications");

            entity.Property(m => m.CurrentMedications)
                .HasColumnName("current_medications");

            entity.Property(m => m.AdditionalNotes)
                .HasColumnName("additional_notes");

            entity.Property(m => m.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(m => m.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(m => m.IsDeleted)
                .HasColumnName("is_deleted");

            entity.HasOne(m => m.Patient)
                .WithOne(p => p.MedicalHistory)
                .HasForeignKey<MedicalHistory>(m => m.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(m => m.PatientId).IsUnique();
        });

        // Admission Details Configuration
        modelBuilder.Entity<AdmissionDetails>(entity =>
        {
            entity.ToTable("admission_details");
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(a => a.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(a => a.AdmissionNumber)
                .HasColumnName("admission_number")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(a => a.Department)
                .HasColumnName("department")
                .HasMaxLength(100);

            entity.Property(a => a.AssignedDoctorId)
                .HasColumnName("assigned_doctor_id")
                .HasMaxLength(50);

            entity.Property(a => a.AdmissionDate)
                .HasColumnName("admission_date");

            entity.Property(a => a.AdmissionType)
                .HasColumnName("admission_type")
                .HasMaxLength(20);

            entity.Property(a => a.ReasonForAdmission)
                .HasColumnName("reason_for_admission");

            entity.Property(a => a.PrimaryDiagnosis)
                .HasColumnName("primary_diagnosis");

            entity.Property(a => a.SecondaryDiagnosis)
                .HasColumnName("secondary_diagnosis");

            entity.Property(a => a.RoomNumber)
                .HasColumnName("room_number")
                .HasMaxLength(20);

            entity.Property(a => a.BedNumber)
                .HasColumnName("bed_number")
                .HasMaxLength(20);

            entity.Property(a => a.RoomType)
                .HasColumnName("room_type")
                .HasMaxLength(20);

            entity.Property(a => a.RoomCharges)
                .HasColumnName("room_charges")
                .HasColumnType("numeric(12,2)");

            entity.Property(a => a.DischargeDate)
                .HasColumnName("discharge_date");

            entity.Property(a => a.DischargeStatus)
                .HasColumnName("discharge_status")
                .HasMaxLength(20);

            entity.Property(a => a.DischargeNotes)
                .HasColumnName("discharge_notes");

            entity.Property(a => a.FollowUpInstructions)
                .HasColumnName("follow_up_instructions");

            entity.Property(a => a.ReferredFrom)
                .HasColumnName("referred_from")
                .HasMaxLength(100);

            entity.Property(a => a.ReferredTo)
                .HasColumnName("referred_to")
                .HasMaxLength(100);

            entity.Property(a => a.SpecialRequirements)
                .HasColumnName("special_requirements");

            entity.Property(a => a.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(a => a.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(a => a.IsDeleted)
                .HasColumnName("is_deleted");

            entity.Property(a => a.CreatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(a => a.Patient)
                .WithMany(p => p.AdmissionHistory)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.AssignedDoctor)
                .WithMany()
                .HasForeignKey(a => a.AssignedDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => a.PatientId);
            entity.HasIndex(a => a.AdmissionNumber).IsUnique();
            entity.HasIndex(a => a.DischargeStatus);
        });

        // Vital Signs Configuration
        modelBuilder.Entity<VitalSigns>(entity =>
        {
            entity.ToTable("vital_signs");
            entity.HasKey(v => v.Id);

            entity.Property(v => v.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(v => v.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(v => v.RecordedByUserId)
                .HasColumnName("recorded_by_user_id")
                .HasMaxLength(50);

            entity.Property(v => v.Temperature)
                .HasColumnName("temperature")
                .HasColumnType("numeric(5,2)");

            entity.Property(v => v.SystolicBP)
                .HasColumnName("systolic_bp");

            entity.Property(v => v.DiastolicBP)
                .HasColumnName("diastolic_bp");

            entity.Property(v => v.PulseRate)
                .HasColumnName("pulse_rate");

            entity.Property(v => v.RespiratoryRate)
                .HasColumnName("respiratory_rate");

            entity.Property(v => v.OxygenSaturation)
                .HasColumnName("oxygen_saturation")
                .HasColumnType("numeric(5,2)");

            entity.Property(v => v.Weight)
                .HasColumnName("weight")
                .HasColumnType("numeric(8,2)");

            entity.Property(v => v.Height)
                .HasColumnName("height")
                .HasColumnType("numeric(8,2)");

            entity.Property(v => v.BMI)
                .HasColumnName("bmi")
                .HasColumnType("numeric(8,2)");

            entity.Property(v => v.Notes)
                .HasColumnName("notes");

            entity.Property(v => v.RecordedAt)
                .HasColumnName("recorded_at");

            entity.Property(v => v.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);
            entity.Property(v => v.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(v => v.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(v => v.Patient)
                .WithMany(p => p.VitalSigns)
                .HasForeignKey(v => v.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(v => v.PatientId);
            entity.HasIndex(v => v.RecordedAt);
        });

        // Medication Configuration
        modelBuilder.Entity<Medication>(entity =>
        {
            entity.ToTable("medications");
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(m => m.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(m => m.MedicationName)
                .HasColumnName("medication_name")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(m => m.Dosage)
                .HasColumnName("dosage")
                .HasMaxLength(50);

            entity.Property(m => m.Frequency)
                .HasColumnName("frequency")
                .HasMaxLength(100);

            entity.Property(m => m.Route)
                .HasColumnName("route")
                .HasMaxLength(50);

            entity.Property(m => m.Reason)
                .HasColumnName("reason");

            entity.Property(m => m.PrescribedByDoctorId)
                .HasColumnName("prescribed_by_doctor_id")
                .HasMaxLength(50);

            entity.Property(m => m.StartDate)
                .HasColumnName("start_date");

            entity.Property(m => m.EndDate)
                .HasColumnName("end_date");

            entity.Property(m => m.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true);

            entity.Property(m => m.SideEffects)
                .HasColumnName("side_effects");

            entity.Property(m => m.Contraindications)
                .HasColumnName("contraindications");

            entity.Property(m => m.Notes)
                .HasColumnName("notes");

            entity.Property(m => m.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(m => m.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(m => m.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);

            entity.Property(m => m.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(m => m.Patient)
                .WithMany(p => p.Medications)
                .HasForeignKey(m => m.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.PrescribedByDoctor)
                .WithMany()
                .HasForeignKey(m => m.PrescribedByDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(m => m.PatientId);
            entity.HasIndex(m => m.IsActive);
            entity.HasIndex(m => m.StartDate);
        });

        // Lab Report Configuration
        modelBuilder.Entity<LabReport>(entity =>
        {
            entity.ToTable("lab_reports");
            entity.HasKey(l => l.Id);

            entity.Property(l => l.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(l => l.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(l => l.ReportNumber)
                .HasColumnName("report_number")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(l => l.TestName)
                .HasColumnName("test_name")
                .HasMaxLength(200);

            entity.Property(l => l.TestCategory)
                .HasColumnName("test_category")
                .HasMaxLength(50);

            entity.Property(l => l.OrderedByDoctorId)
                .HasColumnName("ordered_by_doctor_id")
                .HasMaxLength(50);

            entity.Property(l => l.TestDate)
                .HasColumnName("test_date");

            entity.Property(l => l.ResultDate)
                .HasColumnName("result_date");

            entity.Property(l => l.Status)
                .HasColumnName("status")
                .HasMaxLength(20);

            entity.Property(l => l.TestResult)
                .HasColumnName("test_result");

            entity.Property(l => l.ReferenceRange)
                .HasColumnName("reference_range");

            entity.Property(l => l.NormalValue)
                .HasColumnName("normal_value");

            entity.Property(l => l.ObservedValue)
                .HasColumnName("observed_value");

            entity.Property(l => l.IsAbnormal)
                .HasColumnName("is_abnormal")
                .HasDefaultValue(false);

            entity.Property(l => l.LabName)
                .HasColumnName("lab_name")
                .HasMaxLength(150);

            entity.Property(l => l.TechnicianName)
                .HasColumnName("technician_name")
                .HasMaxLength(100);

            entity.Property(l => l.PathologistName)
                .HasColumnName("pathologist_name");

            entity.Property(l => l.Notes)
                .HasColumnName("notes");

            entity.Property(l => l.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(l => l.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(l => l.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(l => l.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(l => l.Patient)
                .WithMany(p => p.LabReports)
                .HasForeignKey(l => l.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.OrderedByDoctor)
                .WithMany()
                .HasForeignKey(l => l.OrderedByDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(l => l.PatientId);
            entity.HasIndex(l => l.ReportNumber).IsUnique();
            entity.HasIndex(l => l.TestDate);
            entity.HasIndex(l => l.Status);
        });

        // Progress Note Configuration
        modelBuilder.Entity<ProgressNote>(entity =>
        {
            entity.ToTable("progress_notes");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(p => p.PatientId)
                .HasColumnName("patient_id")
                .IsRequired();

            entity.Property(p => p.EnteredByUserId)
                .HasColumnName("entered_by_user_id")
                .HasMaxLength(50);

            entity.Property(p => p.EnteredByUserRole)
                .HasColumnName("entered_by_user_role")
                .HasMaxLength(50);

            entity.Property(p => p.Title)
                .HasColumnName("title")
                .HasMaxLength(200);

            entity.Property(p => p.NoteType)
                .HasColumnName("note_type")
                .HasMaxLength(50)
                .HasDefaultValue("General");

            entity.Property(p => p.NoteContent)
                .HasColumnName("note_content");

            entity.Property(p => p.Diagnosis)
                .HasColumnName("diagnosis");

            entity.Property(p => p.TreatmentPlan)
                .HasColumnName("treatment_plan");

            entity.Property(p => p.Observations)
                .HasColumnName("observations");

            entity.Property(p => p.Recommendations);

            entity.Property(p => p.IsCritical)
                .HasColumnName("is_critical")
                .HasDefaultValue(false);

            entity.Property(p => p.NotedAt)
                .HasColumnName("noted_at");

            entity.Property(p => p.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false)
                .HasColumnName("noted_at");

            entity.Property(p => p.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(p => p.Patient)
                .WithMany(pat => pat.ProgressNotes)
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(p => p.PatientId);
            entity.HasIndex(p => p.NotedAt);
            entity.HasIndex(p => p.IsCritical);
        });
    }
}
