namespace HMS.Application.Features.Patients;

public class MedicalHistoryDto
{
    public string Id { get; set; } = string.Empty;
    public long PatientId { get; set; }
    public string? KnownAllergies { get; set; }
    public bool HasDrugAllergy { get; set; }
    public bool HasFoodAllergy { get; set; }
    public string? AllergySeverity { get; set; }
    public string? ChronicConditions { get; set; }
    public bool IsDiabetic { get; set; }
    public bool IsHypertensive { get; set; }
    public bool HasHeartDisease { get; set; }
    public bool HasAsthma { get; set; }
    public bool HasKidneyDisease { get; set; }
    public bool HasThyroidDisease { get; set; }
    public string? FamilyHistoryOfDiabetes { get; set; }
    public string? FamilyHistoryOfHeartDisease { get; set; }
    public string? FamilyHistoryOfCancer { get; set; }
    public string? OtherFamilyHistory { get; set; }
    public string? PreviousSurgeries { get; set; }
    public string? Vaccinations { get; set; }
    public bool IsSmoker { get; set; }
    public bool UsesAlcohol { get; set; }
    public string? ExerciseFrequency { get; set; }
    public string? PastMedications { get; set; }
    public string? CurrentMedications { get; set; }
    public string? AdditionalNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
