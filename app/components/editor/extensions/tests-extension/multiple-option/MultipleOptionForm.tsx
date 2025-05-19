import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from "~/components/ui/checkbox";

interface Option {
  value: string;
  label: string;
}

interface MultipleOptionFormProps {
  onSubmit: (data: {
    options: Option[];
    correctAnswers: string[];
  }) => void;
}

export function MultipleOptionForm({ onSubmit }: MultipleOptionFormProps) {
  const [options, setOptions] = useState<Option[]>([
    { value: uuidv4(), label: "" }
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  const handleAddOption = () => {
    setOptions([...options, { value: uuidv4(), label: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    setCorrectAnswers(correctAnswers.filter(value => 
      newOptions.some(opt => opt.value === value)
    ));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: value };
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (value: string, checked: boolean) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, value]);
    } else {
      setCorrectAnswers(correctAnswers.filter(v => v !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.label.trim());
    onSubmit({ options: validOptions, correctAnswers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[500px]">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.value} className="flex items-center gap-2">
            <div className="relative flex-1 space-y-1">
              <Label className="mb-2 mt-4" htmlFor={`label-${option.value}`}>Option {index + 1}</Label>
              <div className="flex flex-row gap-2 justify-center items-center">
                <div className="flex-1 items-center gap-2">
              <Input
                id={`label-${option.value}`}
                value={option.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                placeholder="Enter option text"
                    className={correctAnswers.includes(option.value) ? "border-green-600 focus-visible:ring-green-600" : ""}
              />
            {options.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                      className="absolute top-[42px] right-8 size-7 opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                      <X className="size-4" />
              </Button>
            )}
          </div>
                  <Checkbox
                    id={`correct-${option.value}`}
                    checked={correctAnswers.includes(option.value)}
                    onCheckedChange={(checked) => handleCorrectAnswerChange(option.value, checked as boolean)}
                    className="size-5 hover:bg-accent hover:cursor-pointer data-[state=checked]:bg-accent data-[state=checked]:text-green-600 data-[state=checked]:border-green-600"
                  />
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          disabled={options.length === 5}
          onClick={handleAddOption}
          className="flex items-center gap-1"
        >
          <Plus className="size-4"/>
          Add Option
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit"
            disabled={
              correctAnswers.length < 2 ||
              correctAnswers.length === options.length ||
              options.some(opt => opt.label.trim() === "")
            }
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  );
}