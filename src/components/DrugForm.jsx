import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DrugForm = ({ onAddDrug }) => {
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [startTime, setStartTime] = useState('06:00');

  const generateAlertTimes = (start, count) => {
    const [hour, minute] = start.split(':').map(Number);
    const interval = Math.floor((14 * 60) / (count - 1)); // 14 hours between 6AM–8PM
    return Array.from({ length: count }, (_, i) => {
      const totalMinutes = hour * 60 + minute + i * interval;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    });
  };

  const handleAddDrug = () => {
    if (drugName && dosage && startTime) {
      const alerts = generateAlertTimes(startTime, parseInt(dosage, 10));
      onAddDrug({
        name: drugName,
        dosage: parseInt(dosage, 10),
        dosesTaken: 0,
        takenTimes: [],
        alertTimes: alerts,
      });
      setDrugName('');
      setDosage('');
      setStartTime('06:00');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input
        className="border border-gray-300 focus-visible:ring-[1px] focus-visible:ring-gray-400 px-2 py-1 text-sm"
        type="text"
        placeholder="Drug name"
        value={drugName}
        onChange={(e) => setDrugName(e.target.value)}
      />
      <Input
        className="border border-gray-300 focus-visible:ring-[1px] focus-visible:ring-gray-400 px-2 py-1 text-sm"
        type="number"
        placeholder="Dosage per day"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
      />
      <Input
        className="border border-gray-300 focus-visible:ring-[1px] focus-visible:ring-gray-400 px-2 py-1 text-sm"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <Button className="bg-black hover:bg-gray-900 text-white" onClick={handleAddDrug}>
        Add Drug
      </Button>
    </div>
  );
};

export default DrugForm;
