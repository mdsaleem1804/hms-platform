namespace HMS.Application.Features.Doctors;

public class CreateDoctorDto
{
    public string Name { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
}

public class DoctorDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DoctorSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty;
}
