type AnyRecord = Record<string, unknown>;

const asRecord = (value: unknown): AnyRecord => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as AnyRecord;
  }
  return {};
};

const pick = (source: AnyRecord, keys: string[], fallback?: unknown): unknown => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return fallback;
};

const toStringSafe = (value: unknown, fallback = ''): string => {
  if (value === undefined || value === null) return fallback;
  return String(value);
};

const toNumberSafe = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBooleanSafe = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
};

const mapReferral = (raw: unknown) => {
  const source = asRecord(raw);
  return {
    doctorReferralChecked: toBooleanSafe(pick(source, ['doctorReferralChecked', 'DoctorReferralChecked', 'doctor_referral_checked'])),
    doctorReferralName: toStringSafe(pick(source, ['doctorReferralName', 'DoctorReferralName', 'doctor_referral_name'])),
    doctorReferralDepartment: toStringSafe(pick(source, ['doctorReferralDepartment', 'DoctorReferralDepartment', 'doctor_referral_department'])),
    doctorReferralHospital: toStringSafe(pick(source, ['doctorReferralHospital', 'DoctorReferralHospital', 'doctor_referral_hospital'])),
    patientRelativeChecked: toBooleanSafe(pick(source, ['patientRelativeChecked', 'PatientRelativeChecked', 'patient_relative_checked'])),
    patientRelativeSameDept: toBooleanSafe(pick(source, ['patientRelativeSameDept', 'PatientRelativeSameDept', 'patient_relative_same_dept'])),
    patientRelativeOthers: toStringSafe(pick(source, ['patientRelativeOthers', 'PatientRelativeOthers', 'patient_relative_others'])),
    onlineSearchEngineGoogle: toBooleanSafe(pick(source, ['onlineSearchEngineGoogle', 'OnlineSearchEngineGoogle', 'online_search_engine_google'])),
    onlineSearchEngineWebsite: toBooleanSafe(pick(source, ['onlineSearchEngineWebsite', 'OnlineSearchEngineWebsite', 'online_search_engine_website'])),
    onlineSearchEngineOthers: toStringSafe(pick(source, ['onlineSearchEngineOthers', 'OnlineSearchEngineOthers', 'online_search_engine_others'])),
    onlineSocialFacebook: toBooleanSafe(pick(source, ['onlineSocialFacebook', 'OnlineSocialFacebook', 'online_social_facebook'])),
    onlineSocialInstagram: toBooleanSafe(pick(source, ['onlineSocialInstagram', 'OnlineSocialInstagram', 'online_social_instagram'])),
    onlineSocialWhatsapp: toBooleanSafe(pick(source, ['onlineSocialWhatsapp', 'OnlineSocialWhatsapp', 'online_social_whatsapp'])),
    onlineSocialOthers: toStringSafe(pick(source, ['onlineSocialOthers', 'OnlineSocialOthers', 'online_social_others'])),
    offlineTransportBuses: toBooleanSafe(pick(source, ['offlineTransportBuses', 'OfflineTransportBuses', 'offline_transport_buses'])),
    offlineTransportOthers: toStringSafe(pick(source, ['offlineTransportOthers', 'OfflineTransportOthers', 'offline_transport_others'])),
    offlinePublicTheatres: toBooleanSafe(pick(source, ['offlinePublicTheatres', 'OfflinePublicTheatres', 'offline_public_theatres'])),
    offlinePublicBanners: toBooleanSafe(pick(source, ['offlinePublicBanners', 'OfflinePublicBanners', 'offline_public_banners'])),
    offlinePublicBarricades: toBooleanSafe(pick(source, ['offlinePublicBarricades', 'OfflinePublicBarricades', 'offline_public_barricades'])),
    offlinePublicRoadside: toBooleanSafe(pick(source, ['offlinePublicRoadside', 'OfflinePublicRoadside', 'offline_public_roadside'])),
    offlinePublicOthers: toStringSafe(pick(source, ['offlinePublicOthers', 'OfflinePublicOthers', 'offline_public_others'])),
    offlineSignagesNameBoards: toBooleanSafe(pick(source, ['offlineSignagesNameBoards', 'OfflineSignagesNameBoards', 'offline_signages_name_boards'])),
    offlineSignagesPamphlets: toBooleanSafe(pick(source, ['offlineSignagesPamphlets', 'OfflineSignagesPamphlets', 'offline_signages_pamphlets'])),
    offlineSignagesOthers: toStringSafe(pick(source, ['offlineSignagesOthers', 'OfflineSignagesOthers', 'offline_signages_others'])),
    offlineMassTv: toBooleanSafe(pick(source, ['offlineMassTv', 'OfflineMassTv', 'offline_mass_tv'])),
    offlineMassFm: toBooleanSafe(pick(source, ['offlineMassFm', 'OfflineMassFm', 'offline_mass_fm'])),
    offlineMassNewspapers: toBooleanSafe(pick(source, ['offlineMassNewspapers', 'OfflineMassNewspapers', 'offline_mass_newspapers'])),
    offlineMassOthers: toStringSafe(pick(source, ['offlineMassOthers', 'OfflineMassOthers', 'offline_mass_others'])),
    offlineGatheringsHealthCamps: toBooleanSafe(pick(source, ['offlineGatheringsHealthCamps', 'OfflineGatheringsHealthCamps', 'offline_gatherings_health_camps'])),
    offlineGatheringsAwareness: toBooleanSafe(pick(source, ['offlineGatheringsAwareness', 'OfflineGatheringsAwareness', 'offline_gatherings_awareness'])),
    offlineGatheringsOthers: toStringSafe(pick(source, ['offlineGatheringsOthers', 'OfflineGatheringsOthers', 'offline_gatherings_others'])),
  };
};

export const mapPatient = (apiData: unknown) => {
  const source = asRecord(apiData);
  const emergencyContact = asRecord(
    pick(source, ['emergencyContact', 'EmergencyContact', 'emergency_contact'], {})
  );
  const attender = asRecord(pick(source, ['attender', 'Attender'], {}));

  return {
    id: toNumberSafe(pick(source, ['id', 'Id']), 0),
    uhid: toStringSafe(pick(source, ['uhid', 'UHID', 'Uhid'])),
    patientName: toStringSafe(pick(source, ['patientName', 'PatientName', 'patient_name'])),
    dob: toStringSafe(pick(source, ['dob', 'Dob', 'dateOfBirth', 'DateOfBirth'])),
    age: toNumberSafe(pick(source, ['age', 'Age']), 0),
    gender: toStringSafe(pick(source, ['gender', 'Gender'])),
    bloodGroup: toStringSafe(pick(source, ['bloodGroup', 'BloodGroup', 'blood_group'])),
    mobile: toStringSafe(pick(source, ['mobile', 'Mobile'])),
    email: toStringSafe(pick(source, ['email', 'Email'])),
    address: toStringSafe(pick(source, ['address', 'Address'])),
    postalCode: toStringSafe(pick(source, ['postalCode', 'PostalCode', 'postal_code'])),
    photo: pick(source, ['photo', 'Photo']) ? toStringSafe(pick(source, ['photo', 'Photo'])) : null,
    idProofType: toStringSafe(pick(source, ['idProofType', 'IdProofType', 'id_proof_type'])),
    idProofNumber: toStringSafe(pick(source, ['idProofNumber', 'IdProofNumber', 'id_proof_number'])),
    status: toStringSafe(pick(source, ['status', 'Status']), 'ACTIVE'),
    emergencyContact: {
      name: toStringSafe(pick(emergencyContact, ['name', 'Name'])),
      relationship: toStringSafe(pick(emergencyContact, ['relationship', 'Relationship'])),
      contactNumber: toStringSafe(pick(emergencyContact, ['contactNumber', 'ContactNumber', 'contact_number'])),
    },
    attender: {
      name: toStringSafe(pick(attender, ['name', 'Name'])),
      phone: toStringSafe(pick(attender, ['phone', 'Phone'])),
      address: toStringSafe(pick(attender, ['address', 'Address'])),
      idProofType: toStringSafe(pick(attender, ['idProofType', 'IdProofType', 'id_proof_type'])),
      idProofNumber: toStringSafe(pick(attender, ['idProofNumber', 'IdProofNumber', 'id_proof_number'])),
    },
    referral: mapReferral(pick(source, ['referral', 'Referral'], {})),
  };
};

export const mapPatientSummary = (apiData: unknown) => {
  const mapped = mapPatient(apiData);
  return {
    id: mapped.id,
    uhid: mapped.uhid,
    patientName: mapped.patientName,
    dob: mapped.dob,
    age: mapped.age,
    gender: mapped.gender,
    bloodGroup: mapped.bloodGroup,
    mobile: mapped.mobile,
  };
};

export const mapAppointment = (apiData: unknown) => {
  const source = asRecord(apiData);
  const remindersRaw = pick(source, ['reminders', 'Reminders'], []);
  const remindersArray = Array.isArray(remindersRaw) ? remindersRaw : [];

  return {
    id: toStringSafe(pick(source, ['id', 'Id'])),
    displayId: toNumberSafe(pick(source, ['displayId', 'DisplayId'])),
    appointmentNo: toStringSafe(pick(source, ['appointmentNo', 'AppointmentNo'])),
    patientId: toNumberSafe(pick(source, ['patientId', 'PatientId'])),
    patientUhid: toStringSafe(pick(source, ['patientUhid', 'PatientUhid'])),
    patientName: toStringSafe(pick(source, ['patientName', 'PatientName'])),
    doctorId: toStringSafe(pick(source, ['doctorId', 'DoctorId'])),
    doctorName: toStringSafe(pick(source, ['doctorName', 'DoctorName'])),
    doctorSpecialization: toStringSafe(pick(source, ['doctorSpecialization', 'DoctorSpecialization'])),
    departmentId: toStringSafe(pick(source, ['departmentId', 'DepartmentId'])),
    departmentName: toStringSafe(pick(source, ['departmentName', 'DepartmentName', 'department', 'Department'])),
    appointmentDate: toStringSafe(pick(source, ['appointmentDate', 'AppointmentDate'])),
    startTime: toStringSafe(pick(source, ['startTime', 'StartTime'])),
    endTime: toStringSafe(pick(source, ['endTime', 'EndTime'])),
    tokenNumber: toNumberSafe(pick(source, ['tokenNumber', 'TokenNumber'])),
    status: toStringSafe(pick(source, ['status', 'Status'])),
    visitType: toStringSafe(pick(source, ['visitType', 'VisitType'])),
    priority: toStringSafe(pick(source, ['priority', 'Priority'])),
    notes: toStringSafe(pick(source, ['notes', 'Notes'])),
    createdAt: toStringSafe(pick(source, ['createdAt', 'CreatedAt'])),
    reminders: remindersArray.map((rawReminder) => {
      const reminder = asRecord(rawReminder);
      return {
        id: toStringSafe(pick(reminder, ['id', 'Id'])),
        channel: toStringSafe(pick(reminder, ['channel', 'Channel'])),
        timing: toStringSafe(pick(reminder, ['timing', 'Timing'])),
      };
    }),
  };
};

export const debugApiResponse = (context: string, payload: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[API DEBUG] ${context}`, payload);
  }
};
