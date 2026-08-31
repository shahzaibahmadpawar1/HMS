'use client';

import React, { useState } from 'react';
import { Input } from './input';

export function CnicInput({ defaultValue = '', name = 'cnic' }: { defaultValue?: string, name?: string }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    let val = e.target.value.replace(/\D/g, '');
    
    // Auto-insert hyphens: 12345-6789012-3
    if (val.length > 5 && val.length <= 12) {
      val = val.substring(0, 5) + '-' + val.substring(5);
    } else if (val.length > 12) {
      val = val.substring(0, 5) + '-' + val.substring(5, 12) + '-' + val.substring(12, 13);
    }
    
    setValue(val);
  };

  return (
    <Input 
      name={name}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="12345-6789012-3"
      pattern="^\d{5}-\d{7}-\d{1}$"
      maxLength={15}
      title="CNIC must be in the format 12345-6789012-3"
    />
  );
}
