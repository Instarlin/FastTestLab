import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/Input";
import { Label } from "~/components/ui/label";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface Option {
  value: string;
  label: string;
}

interface MultipleOptionFormProps {
  onSubmit: (options: Option[]) => void;
}

export function MultipleOptionForm({ onSubmit }: MultipleOptionFormProps) {
  const [options, setOptions] = useState<Option[]>([
    { value: uuidv4(), label: "" }
  ]);

  const handleAddOption = () => {
    setOptions([...options, { value: uuidv4(), label: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: value };
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
    e.preventDefault();
    const validOptions = options.filter(opt => opt.label.trim());
    onSubmit(validOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.value} className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`label-${option.value}`}>Option {index + 1}</Label>
              <Input
                id={`label-${option.value}`}
                value={option.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                placeholder="Enter option text"
              />
            </div>
            {options.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                className="mt-4"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddOption}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
        <div className="flex gap-2">
          <Button type="submit">Create</Button>
        </div>
      </div>
    </form>
  );
}