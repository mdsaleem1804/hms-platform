using HMS.Application.Features.DoctorServiceRates;
using HMS.Application.Repositories;
using HMS.Domain.Entities;

namespace HMS.Application.Services;

public class DoctorServiceRateService : IDoctorServiceRateService
{
    private readonly IDoctorServiceRateRepository _repository;
    private readonly IDoctorRepository _doctorRepository;

    public DoctorServiceRateService(IDoctorServiceRateRepository repository, IDoctorRepository doctorRepository)
    {
        _repository = repository;
        _doctorRepository = doctorRepository;
    }

    public async Task<DoctorServiceRateDto?> GetByIdAsync(string id)
    {
        var rate = await _repository.GetByIdAsync(id);
        return rate == null ? null : MapToDto(rate);
    }

    public async Task<List<DoctorServiceRateSummaryDto>> GetByDoctorIdAsync(string doctorId)
    {
        var rates = await _repository.GetByDoctorIdAsync(doctorId);
        return rates.Select(MapToSummaryDto).ToList();
    }

    public async Task<decimal> GetServiceRateAsync(string doctorId, string serviceName, DateTime? date = null)
    {
        date ??= DateTime.UtcNow;
        
        // Normalize the DateTime to unspecified kind to match PostgreSQL 'timestamp without time zone'
        var normalizedDate = DateTime.SpecifyKind(date.Value.Date, DateTimeKind.Unspecified);

        var rate = await _repository.GetActiveRatesByDoctorAndDateAsync(doctorId, normalizedDate)
            .ContinueWith(async task => 
            {
                var rates = await task;
                return rates.FirstOrDefault(r => r.ServiceName.Equals(serviceName, StringComparison.OrdinalIgnoreCase));
            })
            .Result;

        if (rate == null)
            throw new KeyNotFoundException($"No active rate found for doctor {doctorId} and service {serviceName} on {date:yyyy-MM-dd HH:mm:ss}");

        return rate.Rate;
    }

    public async Task<DoctorServiceRateDto> CreateAsync(CreateDoctorServiceRateDto request, string createdBy)
    {
        // Validate doctor exists
        var doctor = await _doctorRepository.GetByIdAsync(request.DoctorId);
        if (doctor == null)
            throw new KeyNotFoundException($"Doctor with ID {request.DoctorId} not found");

        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.ServiceName))
            throw new ArgumentException("Service name is required");

        if (request.Rate <= 0)
            throw new ArgumentException("Service rate must be greater than zero");

        if (request.EffectiveFrom == default)
            request.EffectiveFrom = DateTime.UtcNow;

        // Check for duplicate active rates
        var existing = await _repository.GetByDoctorAndServiceAsync(request.DoctorId, request.ServiceName);
        if (existing != null && existing.IsActive)
            throw new InvalidOperationException($"An active rate already exists for doctor {doctor.Name} and service {request.ServiceName}");

        var rateEntity = new DoctorServiceRate
        {
            Id = Guid.NewGuid().ToString(),
            DoctorId = request.DoctorId,
            ServiceName = request.ServiceName.Trim(),
            ServiceDescription = request.ServiceDescription?.Trim(),
            Rate = request.Rate,
            EffectiveFrom = request.EffectiveFrom,
            EffectiveTo = request.EffectiveTo,
            IsActive = true,
            CreatedBy = createdBy,
            UpdatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(rateEntity);
        return MapToDto(created);
    }

    public async Task<DoctorServiceRateDto> UpdateAsync(string id, CreateDoctorServiceRateDto request, string updatedBy)
    {
        var rate = await _repository.GetByIdAsync(id);
        if (rate == null)
            throw new KeyNotFoundException($"Service rate with ID {id} not found");

        // Validate doctor exists if changed
        if (rate.DoctorId != request.DoctorId)
        {
            var doctor = await _doctorRepository.GetByIdAsync(request.DoctorId);
            if (doctor == null)
                throw new KeyNotFoundException($"Doctor with ID {request.DoctorId} not found");
            rate.DoctorId = request.DoctorId;
        }

        if (request.Rate <= 0)
            throw new ArgumentException("Service rate must be greater than zero");

        rate.ServiceName = request.ServiceName.Trim();
        rate.ServiceDescription = request.ServiceDescription?.Trim();
        rate.Rate = request.Rate;
        rate.EffectiveFrom = request.EffectiveFrom;
        rate.EffectiveTo = request.EffectiveTo;
        rate.UpdatedBy = updatedBy;
        rate.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(rate);
        return MapToDto(rate);
    }

    public async Task DeleteAsync(string id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task<List<DoctorServiceRateSummaryDto>> GetAllAsync(int page = 1, int pageSize = 10)
    {
        var rates = await _repository.GetAllAsync(page, pageSize);
        return rates.Select(MapToSummaryDto).ToList();
    }

    public async Task<bool> ExistsAsync(string doctorId, string serviceName)
    {
        return await _repository.ExistsAsync(doctorId, serviceName);
    }

    private static DoctorServiceRateDto MapToDto(DoctorServiceRate rate) => new()
    {
        Id = rate.Id,
        DoctorId = rate.DoctorId,
        ServiceName = rate.ServiceName,
        ServiceDescription = rate.ServiceDescription,
        Rate = rate.Rate,
        IsActive = rate.IsActive,
        EffectiveFrom = rate.EffectiveFrom,
        EffectiveTo = rate.EffectiveTo,
        CreatedBy = rate.CreatedBy,
        UpdatedBy = rate.UpdatedBy,
        CreatedAt = rate.CreatedAt,
        UpdatedAt = rate.UpdatedAt
    };

    private static DoctorServiceRateSummaryDto MapToSummaryDto(DoctorServiceRate rate) => new()
    {
        Id = rate.Id,
        DoctorId = rate.DoctorId,
        ServiceName = rate.ServiceName,
        Rate = rate.Rate,
        IsActive = rate.IsActive,
        EffectiveFrom = rate.EffectiveFrom,
        EffectiveTo = rate.EffectiveTo
    };
}
