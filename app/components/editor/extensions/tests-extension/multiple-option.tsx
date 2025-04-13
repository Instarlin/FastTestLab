import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

export function MultipleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const defaultValues = props.node.attrs.defaultValues || [];
  const nodeId = props.node.attrs.id || props.node.attrs._id || uuidv4();
  const [isEditable, setIsEditable] = useState(props.editor.isEditable);

  useEffect(() => {
    const updateEditable = () => {
      setIsEditable(props.editor.isEditable);
    };

    props.editor.on('update', updateEditable);
    return () => {
      props.editor.off('update', updateEditable);
    };
  }, [props.editor.isEditable]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (isEditable) {
      const newValues = checked
        ? [...defaultValues, value]
        : defaultValues.filter((v: string) => v !== value);

      props.updateAttributes({
        ...props.node.attrs,
        defaultValues: newValues
      });
    }
  };

  return (
    <NodeViewWrapper>
      <div className="relative group">
        <div className="mt-8 space-y-2">
          {options.map((option: Option, index: number) => (
            <div key={option.value} className="flex items-center rounded-md px-2 hover:bg-accent transitions-colors duration-300">
              <Checkbox
                id={`${nodeId}-c${index}`}
                disabled={isEditable}
                className="hover:cursor-pointer"
              />
              <Label
                className="w-full h-full pl-4 py-3 focus:ring-0 focus:border-0 focus:outline-none hover:cursor-pointer group-data-[disabled=true]:pointer-events-auto group-data-[disabled=true]:opacity-100 peer-disabled:cursor-auto peer-disabled:opacity-100"
                htmlFor={`${nodeId}-c${index}`}
                contentEditable={isEditable}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}