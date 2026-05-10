export const TrustSection = () => {
  const partners = [
    { name: 'Palika Verification', role: 'Local Government' },
    { name: 'AI Fraud Detection', role: 'Security' },
    { name: 'Insurance Collaboration', role: 'Finance' },
    { name: 'Real-time Tracking', role: 'Transparency' },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-wider">
          Trusted by stakeholders across the agricultural ecosystem
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center space-y-2 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Abstract partner logo representation */}
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl font-heading">
                {partner.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{partner.name}</p>
                <p className="text-xs text-slate-500">{partner.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
