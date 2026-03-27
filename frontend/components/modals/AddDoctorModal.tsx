'use client';

import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import doctorService, { CreateDoctorRequest } from '@/services/doctorService';
import departmentService, { DepartmentSummary } from '@/services/departmentService';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultDepartmentId?: string;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
  onSuccess,
  defaultDepartmentId,
}: AddDoctorModalProps) {
  const [formData, setFormData] = useState<CreateDoctorRequest>({
    name: '',
    specialization: '',
    mobile: '',
    departmentId: defaultDepartmentId || '',
  });
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);

  // Load departments on mount
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  // Update default department when prop changes
  useEffect(() => {
    if (defaultDepartmentId && defaultDepartmentId !== formData.departmentId) {
      setFormData(prev => ({ ...prev, departmentId: defaultDepartmentId }));
    }
  }, [defaultDepartmentId]);

  const loadDepartments = async () => {
    try {
      setIsLoadingDepts(true);
      const depts = await departmentService.getAll();
      setDepartments(depts);
    } catch (error) {
      console.error('Failed to load departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoadingDepts(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateMobile = (mobile: string): boolean => {
    return /^\d{10}$/.test(mobile);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await doctorService.create(formData);
      toast.success('Doctor added successfully!');
      setFormData({
        name: '',
        specialization: '',
        mobile: '',
        departmentId: defaultDepartmentId || '',
      });
      setErrors({});
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating doctor:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to create doctor';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      specialization: '',
      mobile: '',
      departmentId: defaultDepartmentId || '',
    });
    setErrors({});
    onClose();
  };

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    ...departments.map(d => ({ value: d.id, label: d.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Doctor"
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating...' : 'Create Doctor'}
          </button>
        </>
      }
    >
      <form className="space-y-5">
        {/* Doctor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Dr. Rajesh Kumar"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="e.g., Cardiology, General Medicine"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.specialization
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300'
            }`}
          />
          {errors.specialization && (
            <p className="mt-1 text-xs text-red-500">{errors.specialization}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.mobile ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          {isLoadingDepts ? (
            <div className="text-sm text-gray-500">Loading departments...</div>
          ) : (
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.departmentId
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              {departmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {errors.departmentId && (
            <p className="mt-1 text-xs text-red-500">{errors.departmentId}</p>
          )}
        </div>

        {/* Auto-filled audit fields info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Note:</p>
              <p>Created By and Updated By fields are automatically populated</p>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
