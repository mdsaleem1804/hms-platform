namespace HMS.Domain.Entities;

public class Doctor : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;

    // Navigation property
    public virtual Department? Department { get; set; }
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public virtual ICollection<DoctorServiceRate> ServiceRates { get; set; } = new List<DoctorServiceRate>();
}
