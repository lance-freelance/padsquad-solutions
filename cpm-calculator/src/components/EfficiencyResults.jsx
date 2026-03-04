import { formatNumber, formatCurrency, formatMultiplier } from '../utils/calculations';

export default function EfficiencyResults({ results }) {
  if (!results) {
    return (
      <div className="ps-card p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-[var(--ps-muted)] text-sm">
          Enter campaign inputs to see efficiency results.
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Traditional Impressions',
      value: formatNumber(results.traditionalImpressions),
      accent: null,
    },
    {
      label: 'Efficient Impressions',
      value: formatNumber(results.efficientImpressions),
      accent: 'teal',
    },
    {
      label: 'Additional Impressions',
      value: '+' + formatNumber(results.additionalImpressions),
      accent: 'pink',
    },
    {
      label: 'Reach Multiplier',
      value: formatMultiplier(results.reachMultiplier),
      accent: 'teal',
    },
    {
      label: 'Value of Efficiency',
      value: formatCurrency(results.dollarValueOfEfficiency),
      accent: 'pink',
    },
  ];

  return (
    <div className="ps-card overflow-hidden">
      <div className="ps-ds-panel-header">
        CPM Efficiency Delta
      </div>
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="ps-stat">
            <div
              className={
                'ps-stat__value' +
                (s.accent === 'pink' ? ' ps-stat__value--pink' : '') +
                (s.accent === 'teal' ? ' ps-stat__value--teal' : '')
              }
            >
              {s.value}
            </div>
            <div className="ps-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
