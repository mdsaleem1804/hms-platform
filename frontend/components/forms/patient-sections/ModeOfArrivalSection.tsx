'use client';

import React, { memo } from 'react';

interface ModeOfArrivalSectionProps {
  referral: {
    doctor_referral_checked: boolean;
    doctor_referral_name: string;
    doctor_referral_department: string;
    doctor_referral_hospital: string;
    patient_relative_checked: boolean;
    patient_relative_same_dept: boolean;
    patient_relative_others: string;
    online_search_engine_google: boolean;
    online_search_engine_website: boolean;
    online_search_engine_others: string;
    online_social_facebook: boolean;
    online_social_instagram: boolean;
    online_social_whatsapp: boolean;
    online_social_others: string;
    offline_transport_buses: boolean;
    offline_transport_others: string;
    offline_public_theatres: boolean;
    offline_public_banners: boolean;
    offline_public_barricades: boolean;
    offline_public_roadside: boolean;
    offline_public_others: string;
    offline_signages_name_boards: boolean;
    offline_signages_pamphlets: boolean;
    offline_signages_others: string;
    offline_mass_tv: boolean;
    offline_mass_fm: boolean;
    offline_mass_newspapers: boolean;
    offline_mass_others: string;
    offline_gatherings_health_camps: boolean;
    offline_gatherings_awareness: boolean;
    offline_gatherings_others: string;
  };
  onCheckboxChange: (field: string, value: boolean) => void;
  onInputChange: (field: string, value: string) => void;
}

const ModeOfArrivalSection = memo(({
  referral,
  onCheckboxChange,
  onInputChange,
}: ModeOfArrivalSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Mode of Arrival - Referral Source
      </h2>

      {/* Referrals */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Referrals</h3>
        <div className="space-y-4">
          {/* Doctor's Referral */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="doctor_referral"
              checked={referral.doctor_referral_checked}
              onChange={(e) => onCheckboxChange('doctor_referral_checked', e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="doctor_referral" className="text-sm font-medium text-gray-700 cursor-pointer">
                Doctor's Referral
              </label>
              {referral.doctor_referral_checked && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={referral.doctor_referral_name}
                    onChange={(e) => onInputChange('doctor_referral_name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={referral.doctor_referral_department}
                    onChange={(e) => onInputChange('doctor_referral_department', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Hospital"
                    value={referral.doctor_referral_hospital}
                    onChange={(e) => onInputChange('doctor_referral_hospital', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Patient/Relatives Referral */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="patient_relative"
              checked={referral.patient_relative_checked}
              onChange={(e) => onCheckboxChange('patient_relative_checked', e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="patient_relative" className="text-sm font-medium text-gray-700 cursor-pointer">
                Patient/Relatives
              </label>
              {referral.patient_relative_checked && (
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={referral.patient_relative_same_dept}
                      onChange={(e) => onCheckboxChange('patient_relative_same_dept', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Same Department</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Others"
                    value={referral.patient_relative_others}
                    onChange={(e) => onInputChange('patient_relative_others', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Online Advertisements */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Online Advertisements</h3>
        <div className="space-y-4">
          {/* Search Engine */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Search Engine</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.online_search_engine_google}
                  onChange={(e) => onCheckboxChange('online_search_engine_google', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Google</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.online_search_engine_website}
                  onChange={(e) => onCheckboxChange('online_search_engine_website', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Our Website</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.online_search_engine_others}
                onChange={(e) => onInputChange('online_search_engine_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Social Media</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.online_social_facebook}
                  onChange={(e) => onCheckboxChange('online_social_facebook', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Facebook</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.online_social_instagram}
                  onChange={(e) => onCheckboxChange('online_social_instagram', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Instagram</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.online_social_whatsapp}
                  onChange={(e) => onCheckboxChange('online_social_whatsapp', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.online_social_others}
                onChange={(e) => onInputChange('online_social_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Offline Advertisements */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Offline Advertisements</h3>
        <div className="space-y-4">
          {/* Transport */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Transport</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_transport_buses}
                  onChange={(e) => onCheckboxChange('offline_transport_buses', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Buses</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.offline_transport_others}
                onChange={(e) => onInputChange('offline_transport_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Public Places */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Public Places</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_public_theatres}
                  onChange={(e) => onCheckboxChange('offline_public_theatres', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Theatres</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_public_banners}
                  onChange={(e) => onCheckboxChange('offline_public_banners', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Banners</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_public_barricades}
                  onChange={(e) => onCheckboxChange('offline_public_barricades', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Barricades</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_public_roadside}
                  onChange={(e) => onCheckboxChange('offline_public_roadside', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Roadside</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.offline_public_others}
                onChange={(e) => onInputChange('offline_public_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Signages */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Signages</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_signages_name_boards}
                  onChange={(e) => onCheckboxChange('offline_signages_name_boards', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Name Boards</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_signages_pamphlets}
                  onChange={(e) => onCheckboxChange('offline_signages_pamphlets', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Pamphlets</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.offline_signages_others}
                onChange={(e) => onInputChange('offline_signages_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mass Media */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Mass Media</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_mass_tv}
                  onChange={(e) => onCheckboxChange('offline_mass_tv', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">TV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_mass_fm}
                  onChange={(e) => onCheckboxChange('offline_mass_fm', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">FM</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_mass_newspapers}
                  onChange={(e) => onCheckboxChange('offline_mass_newspapers', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Newspapers</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.offline_mass_others}
                onChange={(e) => onInputChange('offline_mass_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gatherings */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Gatherings</p>
            <div className="space-y-2 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_gatherings_health_camps}
                  onChange={(e) => onCheckboxChange('offline_gatherings_health_camps', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Health Camps</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={referral.offline_gatherings_awareness}
                  onChange={(e) => onCheckboxChange('offline_gatherings_awareness', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Awareness Programs</span>
              </label>
              <input
                type="text"
                placeholder="Others"
                value={referral.offline_gatherings_others}
                onChange={(e) => onInputChange('offline_gatherings_others', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ModeOfArrivalSection.displayName = 'ModeOfArrivalSection';

export default ModeOfArrivalSection;
