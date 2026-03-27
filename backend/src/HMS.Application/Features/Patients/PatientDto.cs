namespace HMS.Application.Features.Patients;

public class PatientListQueryDto
{
    public string? Search { get; set; }
    public string? Gender { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalRecords { get; set; }
    public int TotalPages { get; set; }
}

/// <summary>
/// Lightweight patient summary for search/lookup results.
/// </summary>
public class PatientSummaryDto
{
    public long Id { get; set; }
    public string Uhid { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public DateTime Dob { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
}

public class PatientDto
{
    public long Id { get; set; }
    public string Uhid { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public DateTime Dob { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string?  Photo { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    
    // Nested objects
    public EmergencyContactDto EmergencyContact { get; set; } = new();
    public AttenderDto Attender { get; set; } = new();
    public ReferralDto Referral { get; set; } = new();
}

public class EmergencyContactDto
{
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
}

public class AttenderDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string IdProofType { get; set; } = string.Empty;
    public string IdProofNumber { get; set; } = string.Empty;
}

public class ReferralDto
{
    // Referrals
    public bool DoctorReferralChecked { get; set; }
    public string DoctorReferralName { get; set; } = string.Empty;
    public string DoctorReferralDepartment { get; set; } = string.Empty;
    public string DoctorReferralHospital { get; set; } = string.Empty;
    public bool PatientRelativeChecked { get; set; }
    public bool PatientRelativeSameDept { get; set; }
    public string PatientRelativeOthers { get; set; } = string.Empty;
    
    // Online Advertisements
    public bool OnlineSearchEngineGoogle { get; set; }
    public bool OnlineSearchEngineWebsite { get; set; }
    public string OnlineSearchEngineOthers { get; set; } = string.Empty;
    public bool OnlineSocialFacebook { get; set; }
    public bool OnlineSocialInstagram { get; set; }
    public bool OnlineSocialWhatsapp { get; set; }
    public string OnlineSocialOthers { get; set; } = string.Empty;
    
    // Offline Advertisements
    public bool OfflineTransportBuses { get; set; }
    public string OfflineTransportOthers { get; set; } = string.Empty;
    public bool OfflinePublicTheatres { get; set; }
    public bool OfflinePublicBanners { get; set; }
    public bool OfflinePublicBarricades { get; set; }
    public bool OfflinePublicRoadside { get; set; }
    public string OfflinePublicOthers { get; set; } = string.Empty;
    public bool OfflineSignagesNameBoards { get; set; }
    public bool OfflineSignagesPamphlets { get; set; }
    public string OfflineSignagesOthers { get; set; } = string.Empty;
    public bool OfflineMassTv { get; set; }
    public bool OfflineMassFm { get; set; }
    public bool OfflineMassNewspapers { get; set; }
    public string OfflineMassOthers { get; set; } = string.Empty;
    public bool OfflineGatheringsHealthCamps { get; set; }
    public bool OfflineGatheringsAwareness { get; set; }
    public string OfflineGatheringsOthers { get; set; } = string.Empty;
}
