
"use client";

import React, { useEffect, useState } from 'react';
import App from '../../App';

export default function AdminRM() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <App />;
}
