import { useEffect } from 'react';
import { useRouter } from '../lib/router';

export default function Consultation() {
  const { navigate } = useRouter();
  useEffect(() => { navigate('/book'); }, [navigate]);
  return null;
}
