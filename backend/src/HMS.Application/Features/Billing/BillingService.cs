using HMS.Application.Repositories;
using HMS.Domain.Entities;
using DomainBilling = HMS.Domain.Entities.Billing;

namespace HMS.Application.Features.Billing;

public class BillingService : IBillingService
{
    private static readonly HashSet<string> AllowedVisitTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "consultation",
        "follow-up",
        "procedure",
    };

    private static readonly HashSet<string> AllowedPaymentModes = new(StringComparer.OrdinalIgnoreCase)
    {
        "cash",
        "upi",
        "card",
    };

    private readonly IBillingRepository _billingRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IDoctorRepository _doctorRepository;

    public BillingService(
        IBillingRepository billingRepository,
        IPatientRepository patientRepository,
        IAppointmentRepository appointmentRepository,
        IDoctorRepository doctorRepository)
    {
        _billingRepository = billingRepository;
        _patientRepository = patientRepository;
        _appointmentRepository = appointmentRepository;
        _doctorRepository = doctorRepository;
    }

    public async Task<List<BillingDto>> GetAllAsync()
    {
        var billings = await _billingRepository.GetAllAsync();
        return billings.Select(MapToDto).ToList();
    }

    public async Task<BillingPagedResultDto> GetPagedAsync(BillingListQueryDto query)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var (items, totalRecords) = await _billingRepository.GetPagedAsync(
            query.Search,
            query.Status,
            query.DoctorId,
            query.FromDate,
            query.ToDate,
            page,
            pageSize);

        return new BillingPagedResultDto
        {
            Items = items.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalRecords == 0 ? 0 : (int)Math.Ceiling(totalRecords / (double)pageSize),
        };
    }

    public async Task<BillingDto?> GetByIdAsync(string id)
    {
        var billing = await _billingRepository.GetByIdAsync(id);
        return billing == null ? null : MapToDto(billing);
    }

    public async Task<BillingDto?> GetByBillNumberAsync(string billNumber)
    {
        var billing = await _billingRepository.GetByBillNumberAsync(billNumber);
        return billing == null ? null : MapToDto(billing);
    }

    public async Task<BillingDto> CreateAsync(CreateBillingDto request)
    {
        await ValidateRequestAsync(request);

        var sanitizedItems = request.Items
            .Where(item => !string.IsNullOrWhiteSpace(item.ServiceName))
            .Select(item =>
            {
                var qty = Math.Max(1, item.Qty);
                var rate = Math.Max(0m, item.Rate);
                return new CreateBillingItemDto
                {
                    ServiceName = item.ServiceName.Trim(),
                    Qty = qty,
                    Rate = rate,
                };
            })
            .ToList();

        if (sanitizedItems.Count == 0)
        {
            throw new ArgumentException("At least one billing item is required");
        }

        var subtotal = sanitizedItems.Sum(item => item.Qty * item.Rate);
        var discount = CalculateDiscount(subtotal, request.DiscountValue, request.DiscountType);
        var tax = Math.Max(0m, request.Tax);
        var netAmount = subtotal - discount + tax;

        if (netAmount <= 0)
        {
            throw new ArgumentException("Net amount must be greater than 0");
        }

        var paidAmount = Math.Max(0m, request.PaidAmount);

        var billing = new DomainBilling
        {
            BillNumber = await _billingRepository.GetNextBillNumberAsync(),
            PatientId = request.PatientId,
            AppointmentId = string.IsNullOrWhiteSpace(request.AppointmentId) ? null : request.AppointmentId.Trim(),
            VisitType = request.VisitType.Trim().ToLowerInvariant(),
            DoctorId = request.DoctorId.Trim(),
            Date = request.Date == default ? DateTime.UtcNow.Date : request.Date.Date,
            Subtotal = subtotal,
            Discount = discount,
            Tax = tax,
            NetAmount = netAmount,
            PaidAmount = paidAmount,
            PaymentMode = request.PaymentMode.Trim().ToLowerInvariant(),
            TransactionId = string.IsNullOrWhiteSpace(request.TransactionId) ? null : request.TransactionId.Trim(),
            Items = sanitizedItems.Select(item => new BillingItem
            {
                ServiceName = item.ServiceName,
                Qty = item.Qty,
                Rate = item.Rate,
                Amount = item.Qty * item.Rate,
            }).ToList(),
        };

        var created = await _billingRepository.CreateAsync(billing);
        return MapToDto(created);
    }

    public async Task<BillingDto> UpdateAsync(string id, UpdateBillingDto request)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Billing ID is required", nameof(id));
        }

        var existing = await _billingRepository.GetByIdAsync(id.Trim())
            ?? throw new KeyNotFoundException($"Billing with ID {id} not found");

        if (existing.CreatedAt.Date != DateTime.UtcNow.Date)
        {
            throw new InvalidOperationException("Editing is allowed only for records created today");
        }

        await ValidateRequestAsync(request);

        var sanitizedItems = request.Items
            .Where(item => !string.IsNullOrWhiteSpace(item.ServiceName))
            .Select(item =>
            {
                var qty = Math.Max(1, item.Qty);
                var rate = Math.Max(0m, item.Rate);
                return new CreateBillingItemDto
                {
                    ServiceName = item.ServiceName.Trim(),
                    Qty = qty,
                    Rate = rate,
                };
            })
            .ToList();

        if (sanitizedItems.Count == 0)
        {
            throw new ArgumentException("At least one billing item is required");
        }

        var subtotal = sanitizedItems.Sum(item => item.Qty * item.Rate);
        var discount = CalculateDiscount(subtotal, request.DiscountValue, request.DiscountType);
        var tax = Math.Max(0m, request.Tax);
        var netAmount = subtotal - discount + tax;

        if (netAmount <= 0)
        {
            throw new ArgumentException("Net amount must be greater than 0");
        }

        var paidAmount = Math.Max(0m, request.PaidAmount);
        if (paidAmount > netAmount)
        {
            throw new ArgumentException("Paid amount cannot be greater than net amount", nameof(request.PaidAmount));
        }

        existing.PatientId = request.PatientId;
        existing.AppointmentId = string.IsNullOrWhiteSpace(request.AppointmentId) ? null : request.AppointmentId.Trim();
        existing.VisitType = request.VisitType.Trim().ToLowerInvariant();
        existing.DoctorId = request.DoctorId.Trim();
        existing.Date = request.Date == default ? DateTime.UtcNow.Date : request.Date.Date;
        existing.Subtotal = subtotal;
        existing.Discount = discount;
        existing.Tax = tax;
        existing.NetAmount = netAmount;
        existing.PaidAmount = paidAmount;
        existing.PaymentMode = request.PaymentMode.Trim().ToLowerInvariant();
        existing.TransactionId = string.IsNullOrWhiteSpace(request.TransactionId) ? null : request.TransactionId.Trim();

        existing.Items.Clear();
        foreach (var item in sanitizedItems)
        {
            existing.Items.Add(new BillingItem
            {
                ServiceName = item.ServiceName,
                Qty = item.Qty,
                Rate = item.Rate,
                Amount = item.Qty * item.Rate,
            });
        }

        var updated = await _billingRepository.UpdateAsync(existing);
        return MapToDto(updated);
    }

    public async Task CancelAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Billing ID is required", nameof(id));
        }

        await _billingRepository.CancelAsync(id.Trim());
    }

    private async Task ValidateRequestAsync(CreateBillingDto request)
    {
        if (request.PatientId <= 0)
        {
            throw new ArgumentException("Patient selection is required", nameof(request.PatientId));
        }

        if (string.IsNullOrWhiteSpace(request.VisitType) || !AllowedVisitTypes.Contains(request.VisitType.Trim()))
        {
            throw new ArgumentException("Visit type must be one of: consultation, follow-up, procedure", nameof(request.VisitType));
        }

        if (string.IsNullOrWhiteSpace(request.DoctorId))
        {
            throw new ArgumentException("Doctor selection is required", nameof(request.DoctorId));
        }

        if (request.Items == null || request.Items.Count == 0)
        {
            throw new ArgumentException("At least one billing item is required", nameof(request.Items));
        }

        if (string.IsNullOrWhiteSpace(request.PaymentMode) || !AllowedPaymentModes.Contains(request.PaymentMode.Trim()))
        {
            throw new ArgumentException("Payment mode must be one of: cash, upi, card", nameof(request.PaymentMode));
        }

        if (!string.Equals(request.PaymentMode.Trim(), "cash", StringComparison.OrdinalIgnoreCase)
            && string.IsNullOrWhiteSpace(request.TransactionId))
        {
            throw new ArgumentException("Transaction ID is required for UPI/Card payments", nameof(request.TransactionId));
        }

        var patient = await _patientRepository.GetByIdAsync(request.PatientId);
        if (patient == null)
        {
            throw new KeyNotFoundException($"Patient with ID {request.PatientId} not found");
        }

        var doctor = await _doctorRepository.GetByIdAsync(request.DoctorId.Trim());
        if (doctor == null)
        {
            throw new KeyNotFoundException($"Doctor with ID {request.DoctorId} not found");
        }

        if (!string.IsNullOrWhiteSpace(request.AppointmentId))
        {
            var appointment = await _appointmentRepository.GetByIdAsync(request.AppointmentId.Trim())
                ?? throw new KeyNotFoundException($"Appointment with ID {request.AppointmentId} not found");

            if (appointment.PatientId != request.PatientId)
            {
                throw new ArgumentException("Selected appointment does not belong to the selected patient");
            }
        }
    }

    private static decimal CalculateDiscount(decimal subtotal, decimal discountValue, string discountType)
    {
        var normalizedType = string.IsNullOrWhiteSpace(discountType)
            ? "amount"
            : discountType.Trim().ToLowerInvariant();

        var value = Math.Max(0m, discountValue);

        if (subtotal <= 0m || value <= 0m)
        {
            return 0m;
        }

        if (normalizedType == "percentage")
        {
            var boundedPercent = Math.Min(100m, value);
            return Math.Round(subtotal * boundedPercent / 100m, 2);
        }

        return Math.Min(subtotal, value);
    }

    private static BillingDto MapToDto(DomainBilling billing)
    {
        return new BillingDto
        {
            Id = billing.Id,
            BillNumber = billing.BillNumber,
            PatientId = billing.PatientId,
            PatientName = billing.Patient?.PatientName ?? string.Empty,
            PatientUhid = billing.Patient?.Uhid ?? string.Empty,
            AppointmentId = billing.AppointmentId,
            VisitType = billing.VisitType,
            DoctorId = billing.DoctorId,
            DoctorName = billing.Doctor?.Name ?? string.Empty,
            Date = billing.Date,
            Subtotal = billing.Subtotal,
            Discount = billing.Discount,
            Tax = billing.Tax,
            NetAmount = billing.NetAmount,
            PaidAmount = billing.PaidAmount,
            BalanceAmount = Math.Max(0m, billing.NetAmount - billing.PaidAmount),
            Status = GetPaymentStatus(billing.NetAmount, billing.PaidAmount),
            PaymentMode = billing.PaymentMode,
            TransactionId = billing.TransactionId,
            CreatedAt = billing.CreatedAt,
            Items = billing.Items.Select(item => new BillingItemDto
            {
                Id = item.Id,
                ServiceName = item.ServiceName,
                Qty = item.Qty,
                Rate = item.Rate,
                Amount = item.Amount,
            }).ToList(),
        };
    }

    private static string GetPaymentStatus(decimal netAmount, decimal paidAmount)
    {
        if (paidAmount <= 0m)
        {
            return "Pending";
        }

        if (paidAmount >= netAmount)
        {
            return "Paid";
        }

        return "Partial";
    }
}
