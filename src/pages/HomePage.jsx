import { useEffect, useState } from 'react';
import { PlusCircle, Pill, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DrugForm from '@/components/DrugForm';
import DoseProgressBar from '@/components/DoseProgressBar';
import { toast } from 'sonner';

const formatTo12Hour = (time) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

const formatNow = () => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

const HomePage = () => {
  const [drugs, setDrugs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('drugs');
    if (stored) setDrugs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('drugs', JSON.stringify(drugs));
  }, [drugs]);

  const handleAddDrug = (newDrug) => {
    setDrugs([...drugs, newDrug]);
    setIsDialogOpen(false);
    toast.success(`${newDrug.name} added!`);
  };

const handleClearDrugs = () => {
  setDrugs([]);
  localStorage.removeItem('drugs');
  toast.warning('All medications cleared');
};

  const handleTakeDose = (index) => {
    const updated = [...drugs];
    const drug = updated[index];

    if (drug.dosesTaken < drug.dosage) {
      drug.dosesTaken += 1;
      drug.takenTimes = [...(drug.takenTimes || []), formatNow()];
      setDrugs(updated);
      toast(`${drug.name}: Dose taken`, {
        icon: <Pill className="text-blue-500" />,
      });
    }
  };

  const handleResetDay = () => {
    const resetDrugs = drugs.map((drug) => ({
      ...drug,
      dosesTaken: 0,
      takenTimes: [],
    }));
    setDrugs(resetDrugs);
    toast.info('Daily progress reset');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MedTracker</h1>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Drug
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <DrugForm onAddDrug={handleAddDrug} />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleResetDay}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Today
            </Button>
          </div>
        </div>
         
        <Button
  variant="destructive"
  className="flex items-center"
  onClick={handleClearDrugs}
>
  <Pill className="h-4 w-4 mr-1" />
  Clear Drugs
</Button>

        {/* Medication Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {drugs.map((drug, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{drug.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  Start Time: <span className="font-medium">{drug.alertTimes?.[0] && formatTo12Hour(drug.alertTimes[0])}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Alerts: {drug.alertTimes?.map(formatTo12Hour).join(', ')}
                </div>
                {drug.takenTimes?.length > 0 && (
                  <div className="text-sm text-green-600">
                    Taken at: {drug.takenTimes.join(', ')}
                  </div>
                )}
                <DoseProgressBar drug={drug} onTakeDose={() => handleTakeDose(index)} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {drugs.length === 0 && (
          <div className="text-center text-gray-500">
            No medications added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
