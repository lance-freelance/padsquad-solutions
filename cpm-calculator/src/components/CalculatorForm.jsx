import { CAAS_CPM, DEFAULT_PRODUCTION_FEE } from '../utils/calculations';

export default function CalculatorForm({ values, onChange }) {
  const handle = (field) => (e) => {
    const raw = e.target.value;
    onChange({ ...values, [field]: raw === '' ? '' : Number(raw) });
  };

  return (
    <div className="ps-card p-6 space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--ps-muted)]">
        Campaign Inputs
      </h2>

      <div>
        <label className="ps-label" htmlFor="budget">Total Campaign Budget ($)</label>
        <input
          id="budget"
          className="ps-input"
          type="number"
          min="0"
          step="1000"
          placeholder="e.g. 500000"
          value={values.budget}
          onChange={handle('budget')}
        />
      </div>

      <div>
        <label className="ps-label" htmlFor="currentCpm">Current All-In CPM ($)</label>
        <input
          id="currentCpm"
          className="ps-input"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 25.00"
          value={values.currentAllInCpm}
          onChange={handle('currentAllInCpm')}
        />
      </div>

      <div>
        <label className="ps-label" htmlFor="independentCpm">Independent Media CPM ($)</label>
        <input
          id="independentCpm"
          className="ps-input"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 8.00"
          value={values.independentCpm}
          onChange={handle('independentCpm')}
        />
      </div>

      <div className="pt-3 border-t border-[var(--ps-divider)]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ps-muted)] mb-3">
          AdCanvas Fees
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="ps-label" htmlFor="caasCpm">CaaS Serving CPM ($)</label>
            <input
              id="caasCpm"
              className="ps-input"
              type="number"
              min="0"
              step="0.01"
              placeholder={String(CAAS_CPM)}
              value={values.caasCpm}
              onChange={handle('caasCpm')}
            />
          </div>

          <div>
            <label className="ps-label" htmlFor="productionFee">Production Fee ($)</label>
            <input
              id="productionFee"
              className="ps-input"
              type="number"
              min="0"
              step="100"
              placeholder={String(DEFAULT_PRODUCTION_FEE)}
              value={values.productionFee}
              onChange={handle('productionFee')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
