import { useState, useRef, useMemo } from 'react';
import CalculatorForm from './components/CalculatorForm';
import EfficiencyResults from './components/EfficiencyResults';
import InvestmentSummary from './components/InvestmentSummary';
import ResultsExport from './components/ResultsExport';
import { calculateEfficiency, CAAS_CPM, DEFAULT_PRODUCTION_FEE } from './utils/calculations';

const TABS = [
  { id: 'display', label: 'Display / Rich Media' },
  { id: 'video', label: 'Video' },
];

const INITIAL_VALUES = {
  budget: '',
  currentAllInCpm: '',
  independentCpm: '',
  caasCpm: CAAS_CPM,
  productionFee: DEFAULT_PRODUCTION_FEE,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('display');
  const [formValues, setFormValues] = useState({
    display: { ...INITIAL_VALUES },
    video: { ...INITIAL_VALUES },
  });

  const resultsRef = useRef(null);

  const values = formValues[activeTab];

  const setValues = (next) => {
    setFormValues((prev) => ({ ...prev, [activeTab]: next }));
  };

  const results = useMemo(() => {
    const { budget, currentAllInCpm, independentCpm, caasCpm, productionFee } = values;
    return calculateEfficiency(
      budget,
      currentAllInCpm,
      independentCpm,
      {
        caasCpm: caasCpm === '' ? CAAS_CPM : caasCpm,
        productionFee: productionFee === '' ? DEFAULT_PRODUCTION_FEE : productionFee,
      }
    );
  }, [values]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AdCanvas CPM Efficiency Calculator
          </h1>
          <p className="text-sm text-[var(--ps-muted)] max-w-xl mx-auto">
            Compare traditional all-in CPM to independent media CPM and quantify the efficiency gained through AdCanvas.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="ps-tab-bar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={
                  'ps-tab-bar__item' +
                  (activeTab === tab.id ? ' ps-tab-bar__item--active' : '')
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
          {/* Left: form */}
          <CalculatorForm values={values} onChange={setValues} />

          {/* Right: results (export target) */}
          <div className="space-y-6">
            <div ref={resultsRef} className="space-y-6">
              <EfficiencyResults results={results} />
              <InvestmentSummary results={results} />
            </div>

            {results && (
              <div className="flex justify-end">
                <ResultsExport targetRef={resultsRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
