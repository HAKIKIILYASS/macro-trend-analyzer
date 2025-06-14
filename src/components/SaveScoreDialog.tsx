
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';

interface SaveScoreDialogProps {
  onSave: (name: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const SaveScoreDialog: React.FC<SaveScoreDialogProps> = ({ 
  onSave, 
  onCancel, 
  isOpen 
}) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Save size={20} />
              Save Macro Score
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-gray-600"
            >
              <X size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="score-name" className="text-sm font-medium text-gray-700">
                Score Name
              </Label>
              <Input
                id="score-name"
                type="text"
                placeholder="e.g., EUR/USD, GBP/JPY, EURUSD..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="mt-1"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="px-4 bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2" size={16} />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaveScoreDialog;
