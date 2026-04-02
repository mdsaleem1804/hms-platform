'use client';

import { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import doctorService, { Doctor } from '@/services/doctorService';
import departmentService, { DepartmentSummary } from '@/services/departmentService';
import { notify } from '@/lib/toast';
import { formatDate, extractApiError } from '@/lib/utils';

interface FormData {
  name: string;
  specialization: string;
  mobile: string;
  departmentId: string;
}

const defaultForm: FormData = {
  name: '',
  specialization: '',
  mobile: '',
  departmentId: '',
};

export function DoctorManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load doctors on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [doctorData, departmentData] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll(),
      ]);
      setDoctors(doctorData as unknown as Doctor[]);
      setDepartments(departmentData);
    } catch (error) {
      notify.error(extractApiError(error), {
        id: 'doctors:load:error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (doctor: Doctor) => {
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      mobile: doctor.mobile,
      departmentId: doctor.departmentId,
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      if (editingId) {
        // Update existing doctor
        await doctorService.update(editingId, {
          name: formData.name.trim(),
          specialization: formData.specialization.trim(),
          mobile: formData.mobile.trim(),
          departmentId: formData.departmentId,
        });
        notify.success('Doctor updated successfully', {
          id: 'doctors:update:success',
        });
      } else {
        // Create new doctor
        await doctorService.create({
          name: formData.name.trim(),
          specialization: formData.specialization.trim(),
          mobile: formData.mobile.trim(),
          departmentId: formData.departmentId,
        });
        notify.success('Doctor created successfully', {
          id: 'doctors:create:success',
        });
      }

      // Reload doctors
      await loadData();
      handleReset();
    } catch (error) {
      const errorMessage = extractApiError(error);
      notify.error(errorMessage, {
        id: editingId ? 'doctors:update:error' : 'doctors:create:error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeletingId(id);
      await doctorService.delete(id);
      notify.success('Doctor deleted successfully', {
        id: 'doctors:delete:success',
      });
      await loadData();
    } catch (error) {
      notify.error(extractApiError(error), {
        id: 'doctors:delete:error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const getDepartmentName = (departmentId: string) => {
    return departments.find((d) => d.id === departmentId)?.name || '-';
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        <Loader2 className="mx-auto inline-block animate-spin" size={24} />
        <p className="mt-2">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g., Dr. Rajesh Kumar"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => {
                  setFormData({ ...formData, specialization: e.target.value });
                  if (errors.specialization)
                    setErrors({ ...errors, specialization: '' });
                }}
                placeholder="e.g., Cardiology, Orthopedics, General Medicine"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.specialization
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => {
                  setFormData({ ...formData, mobile: e.target.value });
                  if (errors.mobile) setErrors({ ...errors, mobile: '' });
                }}
                placeholder="e.g., 9876543210"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.mobile
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => {
                  setFormData({ ...formData, departmentId: e.target.value });
                  if (errors.departmentId)
                    setErrors({ ...errors, departmentId: '' });
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.departmentId
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Update Doctor' : 'Create Doctor'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setFormData(defaultForm);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Doctor
        </button>
      )}

      {/* Doctors Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <AlertCircle className="mb-3 text-gray-400" size={32} />
            <p className="text-gray-600">No doctors found</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first doctor to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {doctor.specialization}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {doctor.mobile}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {getDepartmentName(doctor.departmentId)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(doctor.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          disabled={isSaving || isDeleting}
                          className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          disabled={isDeleting || deletingId !== null}
                          className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Delete"
                        >
                          {deletingId === doctor.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
