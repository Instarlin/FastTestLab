import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue } from "~/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface SingleOptionFormProps {
  onSubmit: (data: {
    options: Option[];
    correctAnswer: string;
  }) => void;
}

export function SingleOptionForm({ onSubmit }: SingleOptionFormProps) {
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
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
    e.preventDefault();
    const validOptions = options.filter(opt => opt.label.trim());
    onSubmit({ options: validOptions, correctAnswer: correctAnswer });
  };

  return (
    <form onSubmit={handleSubmit} className=" space-y-4 max-h-[500px]">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.value} className="flex items-center gap-2">
            <div className="relative flex-1 space-y-1">
              <Label className="mb-2 mt-4" htmlFor={`label-${option.value}`}>Option {index + 1}</Label>
              <Input
                id={`label-${option.value}`}
                value={option.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
                placeholder="Enter option text"
              />
              {options.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                  className="absolute top-[42px] right-1 size-7 opacity-50 hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={options.length > 10}
            onClick={handleAddOption}
            className="flex items-center gap-1"
          >
            <Plus className="size-4" />
            Add Option
          </Button>
          <Select disabled={options.length === 1} defaultValue={correctAnswer} onValueChange={setCorrectAnswer}>
            <SelectTrigger className="min-w-[200px] max-w-[240px]">
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option, index) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-gray-100">
                    {option.label || "Option " + (index + 1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={
          options.length === 1 || correctAnswer === "" || options.some(opt => opt.label.trim() === "")
        }>
          Create
        </Button>
      </div>
    </form>
  );
}