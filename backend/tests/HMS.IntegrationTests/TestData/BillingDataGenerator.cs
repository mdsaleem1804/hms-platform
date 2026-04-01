using Bogus;
using HMS.Domain.Entities;

namespace HMS.IntegrationTests.TestData;

/// <summary>
/// Generates billing records with realistic amounts and payment statuses.
/// </summary>
public class BillingDataGenerator
{
    private static readonly string[] _paymentModes = new[] { "Cash", "Card", "UPI", "Cheque" };
    private static readonly string[] _visitTypes = new[] { "OPD", "Emergency", "Follow-up", "Teleconsultation" };

    private static int _billNumberCounter = 9001;
    private static readonly object _lockObject = new object();

    /// <summary>
    /// Generates billing record for an appointment.
    /// </summary>
    public static Billing GenerateBilling(
        long patientId,
        string doctorId,
        string? appointmentId,
        string visitType,
        decimal consultationAmount)
    {
        var faker = new Faker();
        var discount = consultationAmount * faker.Random.Decimal(0, 0.2m); // 0-20% discount
        var tax = (consultationAmount - discount) * 0.18m; // 18% GST
        var netAmount = consultationAmount - discount + tax;
        var paidAmount = faker.Random.Decimal(0, netAmount * 1.5m); // Can overpay

        var billing = new Billing
        {
            Id = Guid.NewGuid().ToString(),
            BillNumber = GetNextBillNumber(),
            PatientId = patientId,
            AppointmentId = appointmentId,
            VisitType = visitType,
            DoctorId = doctorId,
            Date = DateTime.UtcNow.AddDays(faker.Random.Int(-60, 0)),
            Subtotal = consultationAmount,
            Discount = Math.Round(discount, 2),
            Tax = Math.Round(tax, 2),
            NetAmount = Math.Round(netAmount, 2),
            PaidAmount = Math.Round(Math.Min(paidAmount, netAmount), 2),
            PaymentMode = faker.PickRandom(_paymentModes),
            TransactionId = paidAmount > 0 ? faker.Random.AlphaNumeric(20).ToUpper() : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        return billing;
    }

    /// <summary>
    /// Generates billing records for multiple appointments.
    /// </summary>
    public static List<Billing> GenerateBillingsForAppointments(
        List<Appointment> appointments,
        Dictionary<string, decimal> doctorConsultationRates)
    {
        var billings = new List<Billing>();

        foreach (var appointment in appointments)
        {
            var consultationRate = doctorConsultationRates.ContainsKey(appointment.DoctorId)
                ? doctorConsultationRates[appointment.DoctorId]
                : 500;

            var billing = GenerateBilling(
                appointment.PatientId,
                appointment.DoctorId,
                appointment.Id,
                appointment.VisitType,
                consultationRate);

            billings.Add(billing);
        }

        return billings;
    }

    /// <summary>
    /// Generates billing with specific payment status.
    /// </summary>
    public static Billing GenerateBillingWithPaymentStatus(
        long patientId,
        string doctorId,
        string appointmentId,
        string visitType,
        decimal consultationAmount,
        string paymentStatus)
    {
        var billing = GenerateBilling(patientId, doctorId, appointmentId, visitType, consultationAmount);

        billing = paymentStatus switch
        {
            "Paid" => new Billing
            {
                Id = billing.Id,
                BillNumber = billing.BillNumber,
                PatientId = billing.PatientId,
                AppointmentId = billing.AppointmentId,
                VisitType = billing.VisitType,
                DoctorId = billing.DoctorId,
                Date = billing.Date,
                Subtotal = billing.Subtotal,
                Discount = billing.Discount,
                Tax = billing.Tax,
                NetAmount = billing.NetAmount,
                PaidAmount = billing.NetAmount, // Full payment
                PaymentMode = billing.PaymentMode,
                TransactionId = $"TXN-{Guid.NewGuid().ToString().Substring(0, 12).ToUpper()}",
                CreatedAt = billing.CreatedAt,
                UpdatedAt = billing.UpdatedAt,
                IsDeleted = billing.IsDeleted
            },
            "Unpaid" => new Billing
            {
                Id = billing.Id,
                BillNumber = billing.BillNumber,
                PatientId = billing.PatientId,
                AppointmentId = billing.AppointmentId,
                VisitType = billing.VisitType,
                DoctorId = billing.DoctorId,
                Date = billing.Date,
                Subtotal = billing.Subtotal,
                Discount = billing.Discount,
                Tax = billing.Tax,
                NetAmount = billing.NetAmount,
                PaidAmount = 0, // No payment
                PaymentMode = "Pending",
                TransactionId = null,
                CreatedAt = billing.CreatedAt,
                UpdatedAt = billing.UpdatedAt,
                IsDeleted = billing.IsDeleted
            },
            "Partial" => new Billing
            {
                Id = billing.Id,
                BillNumber = billing.BillNumber,
                PatientId = billing.PatientId,
                AppointmentId = billing.AppointmentId,
                VisitType = billing.VisitType,
                DoctorId = billing.DoctorId,
                Date = billing.Date,
                Subtotal = billing.Subtotal,
                Discount = billing.Discount,
                Tax = billing.Tax,
                NetAmount = billing.NetAmount,
                PaidAmount = Math.Round(billing.NetAmount * 0.5m, 2), // 50% payment
                PaymentMode = billing.PaymentMode,
                TransactionId = $"TXN-{Guid.NewGuid().ToString().Substring(0, 12).ToUpper()}",
                CreatedAt = billing.CreatedAt,
                UpdatedAt = billing.UpdatedAt,
                IsDeleted = billing.IsDeleted
            },
            _ => billing
        };

        return billing;
    }

    private static string GetNextBillNumber()
    {
        lock (_lockObject)
        {
            return $"BILL-{DateTime.UtcNow:yyyyMMdd}-{_billNumberCounter++}";
        }
    }

    public static void ResetBillNumberCounter(int startFrom = 9001)
    {
        lock (_lockObject)
        {
            _billNumberCounter = startFrom;
        }
    }
}
