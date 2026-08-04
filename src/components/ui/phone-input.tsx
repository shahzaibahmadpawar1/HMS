'use client';

import React, { useState } from 'react';
import { Input } from './input';

export function PhoneInput({ defaultValue = '', name = 'phone' }: { defaultValue?: string, name?: string }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    let val = e.target.value.replace(/\D/g, '');
    
    // Auto-insert hyphen after 4 digits
    if (val.length > 4) {
      val = val.substring(0, 4) + '-' + val.substring(4, 11);
    }
    
    setValue(val);
  };

  return (
    <Input 
      name={name}
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="0300-1234567"
      pattern="^03[0-9]{2}-[0-9]{7}$"
      maxLength={12}
      minLength={12}
      title="Phone number must be exactly 11 digits in the format 03XX-XXXXXXX"
    />
  );
}
