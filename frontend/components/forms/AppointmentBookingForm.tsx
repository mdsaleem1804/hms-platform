'use client';

import React from 'react';
import AppointmentForm, { AppointmentFormProps } from './AppointmentForm';

type AppointmentBookingFormProps = Omit<AppointmentFormProps, 'mode'> & {
  mode?: 'create' | 'edit';
};

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({ mode = 'create', ...props }) => {
  return <AppointmentForm mode={mode} {...props} />;
};

export type { AppointmentFormData } from './AppointmentForm';
export default AppointmentBookingForm;
