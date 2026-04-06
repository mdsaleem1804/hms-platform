  namespace HMS.Domain.Entities;

public class MedicalHistory : BaseEntity
{
    public long PatientId { get; set; }
    
    // Allergies
    public string? KnownAllergies { get; set; } // Comma-separated or JSON
    public bool HasDrugAllergy { get; set; }
    public bool HasFoodAllergy { get; set; }
    public string? AllergySeverity { get; set; } = "Mild"; // Mild, Moderate, Severe
    
    // Chronic conditions
    public string? ChronicConditions { get; set; } // e.g., "Diabetes, Hypertension"
    public bool IsDiabetic { get; set; }
    public bool IsHypertensive { get; set; }
    public bool HasHeartDisease { get; set; }
    public bool HasAsthma { get; set; }
    public bool HasKidneyDisease { get; set; }
    public bool HasThyroidDisease { get; set; }
    
    // Family history
    public string? FamilyHistoryOfDiabetes { get; set; } // None, Father, Mother, Sibling, Multiple
    public string? FamilyHistoryOfHeartDisease { get; set; }
    public string? FamilyHistoryOfCancer { get; set; }
    public string? OtherFamilyHistory { get; set; }
    
    // Surgical history
    public string? PreviousSurgeries { get; set; } // JSON format
    public string? SurgeryDetails { get; set; }
    
    // Immunization
    public string? Vaccinations { get; set; } // JSON format
    public DateTime? LastVaccinationDate { get; set; }
    
    // Lifestyle
    public bool IsSmoker { get; set; }
    public bool UsesAlcohol { get; set; }
    public string? ExerciseFrequency { get; set; } = "Moderate"; // Sedentary, Light, Moderate, Vigorous
    
    // Medications (historical)
    public string? PastMedications { get; set; } // JSON format
    public string? CurrentMedications { get; set; } // JSON format
    
    // Other
    public string? AdditionalNotes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Patient? Patient { get; set; }
}
