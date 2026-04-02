'use client';

import { useState, useEffect } from 'react';
import doctorServiceRateService, { DoctorServiceRateSummaryDto } from '@/services/doctorServiceRateService';

export default function TestDoctorServicesPage() {
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [services, setServices] = useState<DoctorServiceRateSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load doctors on mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
        const data = await response.json();
        console.log('Doctors response:', data);
        setDoctors(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedDoctorId(data.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
        setError(`Failed to load doctors: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Load services when doctor changes
  useEffect(() => {
    if (!selectedDoctorId) return;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Loading services for doctor: ${selectedDoctorId}`);
        const rates = await doctorServiceRateService.getRatesByDoctor(selectedDoctorId);
        console.log('Services from service:', rates);
        setServices(rates);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError(`Failed to load services: ${err}`);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [selectedDoctorId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Doctor Services Test</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Doctor:</label>
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Select a doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.id})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Services for {doctors.find(d => d.id === selectedDoctorId)?.name || 'Selected Doctor'}</h2>
        {services.length === 0 ? (
          <p className="text-gray-500">No services found for this doctor</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Service Name</th>
                  <th className="px-4 py-2 text-left">Rate</th>
                  <th className="px-4 py-2 text-left">Active</th>
                  <th className="px-4 py-2 text-left">Effective From</th>
                  <th className="px-4 py-2 text-left">Effective To</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t">
                    <td className="px-4 py-2">{service.serviceName}</td>
                    <td className="px-4 py-2">₹{service.rate.toFixed(2)}</td>
                    <td className="px-4 py-2">{service.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{service.effectiveFrom}</td>
                    <td className="px-4 py-2">{service.effectiveTo || 'Ongoing'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs overflow-auto max-h-48">
          {JSON.stringify({ doctors, selectedDoctorId, services, loading, error }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
