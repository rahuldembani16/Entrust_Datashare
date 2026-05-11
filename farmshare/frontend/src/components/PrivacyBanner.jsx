import { ShieldCheck } from 'lucide-react';

export default function PrivacyBanner() {
  return (
    <div className="privacy-banner">
      <ShieldCheck size={20} /> Your individual data is never shared. Other users only see anonymised regional summaries.
    </div>
  );
}
