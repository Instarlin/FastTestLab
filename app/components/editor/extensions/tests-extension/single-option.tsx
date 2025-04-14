import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { CheckCircle2 } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export function SingleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const defaultValue = props.node.attrs.defaultValue;
  const correctAnswer = props.node.attrs.correctAnswer;
  const nodeId = props.node.attrs.id || props.node.attrs._id || uuidv4();
  const [isEditable, setIsEditable] = useState(props.editor.isEditable);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    const updateEditable = () => {
      setIsEditable(props.editor.isEditable);
    };

    props.editor.on('update', updateEditable);
    return () => {
      props.editor.off('update', updateEditable);
    };
  }, [props.editor.isEditable]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <NodeViewWrapper>
      <div className="relative group">
        <RadioGroup 
          className="mt-8" 
          value={selectedValue}
          onValueChange={handleValueChange}
          contentEditable={isEditable}
          disabled={isEditable}
        >
          {options.map((option: Option, index: number) => (
            <div key={option.value} className="flex items-center rounded-md px-2 hover:bg-accent transitions-colors duration-300">
              <RadioGroupItem 
                className="hover:cursor-pointer" 
                value={option.value} 
                id={`${nodeId}-r${index}`}
              />
              <Label 
                className="w-full h-full pl-4 py-3 hover:cursor-pointer" 
                htmlFor={`${nodeId}-r${index}`}
              >
                {option.label}
              </Label>
              {!isEditable && correctAnswer === option.value && (
                <CheckCircle2 className="h-5 w-5 text-green-500 ml-2" />
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    </NodeViewWrapper>
  );
}