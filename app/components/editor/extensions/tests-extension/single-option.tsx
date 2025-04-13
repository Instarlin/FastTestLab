import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

interface Option {
  value: string;
  label: string;
}

export function SingleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const defaultValue = props.node.attrs.defaultValue;
  const nodeId = props.node.attrs.id || props.node.attrs._id || Math.random().toString(36).substr(2, 9);

  return (
    <NodeViewWrapper>
      <RadioGroup 
        className="mt-8" 
        defaultValue={defaultValue} 
        contentEditable={false}
        onValueChange={(value) => {
          props.updateAttributes({
            ...props.node.attrs,
            defaultValue: value
          });
        }}
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
          </div>
        ))}
      </RadioGroup>
    </NodeViewWrapper>
  );
}