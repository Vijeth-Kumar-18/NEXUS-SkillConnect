import fs from 'fs';
import path from 'path';
import PageWrapper from '@/components/layout/PageWrapper';
import AnalyticsDashboard from './AnalyticsDashboard';

export default async function AnalyticsPage() {
  const data1Path = path.join(process.cwd(), 'Data1.txt');
  const data2Path = path.join(process.cwd(), 'Data2.txt');
  const data3Path = path.join(process.cwd(), 'Data3.txt');

  let rawData1 = '';
  let rawData2 = '';
  let rawData3 = '';

  try {
    if (fs.existsSync(data1Path)) rawData1 = fs.readFileSync(data1Path, 'utf-8');
    if (fs.existsSync(data2Path)) rawData2 = fs.readFileSync(data2Path, 'utf-8');
    if (fs.existsSync(data3Path)) rawData3 = fs.readFileSync(data3Path, 'utf-8');
  } catch (err) {
    console.error('Could not read mock datasets', err);
  }

  return (
    <PageWrapper>
      <div className="mb-10 lg:pl-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">Analytics</span>
        </h1>
        <p className="text-lg font-medium text-slate-300 max-w-3xl leading-relaxed">
          Deep structural analysis connecting enterprise job demand to the university cohort's active skill sets. Built natively on generated mock datasets (Data1.txt, Data2.txt & Data3.txt).
        </p>
      </div>

      <AnalyticsDashboard data1={rawData1} data2={rawData2} data3={rawData3} />
    </PageWrapper>
  );
}
