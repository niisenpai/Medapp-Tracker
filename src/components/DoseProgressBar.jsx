import { PlusCircle, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DoseProgressBar = ({ drug, onTakeDose }) => {
  const progress = (drug.dosesTaken / drug.dosage) * 100;

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Pill className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="font-medium truncate text-sm">{drug.name}</span>
      </div>
      <div className="flex items-center space-x-2 flex-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {drug.dosesTaken}/{drug.dosage}
        </span>
      </div>
      <Button
        size="sm"
        onClick={onTakeDose}
        disabled={drug.dosesTaken >= drug.dosage}
        className="px-2 py-1"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DoseProgressBar;
