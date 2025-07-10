import { useState, useEffect, useRef, useCallback } from 'react';
import { NodeViewWrapper } from "@tiptap/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { handleKeyDown } from '../option/keyHandlers';
import type { NodeViewProps } from "@tiptap/react";
import type { Option } from "../option/types";
import type { KeyboardEvent } from 'react';

export function SingleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const nodeId = props.node.attrs.id || props.node.attrs._id || uuidv4();
  const [isEditable, setIsEditable] = useState(props.editor.isEditable);
  const [newOptions, setNewOptions] = useState<Option[]>([...options]);
  const [selectedValue, setSelectedValue] = useState<string>(props.node.attrs.selectedValue || '');
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
  const labelRefs = useRef<(HTMLLabelElement | null)[]>([]);

  useEffect(() => {
    setNewOptions([...options]);
    setSelectedValue(props.node.attrs.selectedValue || '');
  }, [options, props.node.attrs.selectedValue]);

  useEffect(() => {
    const updateEditable = () => {
      setIsEditable(props.editor.isEditable);
    };

    props.editor.on('update', updateEditable);
    return () => {
      props.editor.off('update', updateEditable);
    };
  }, [props.editor]);

  useEffect(() => {
    if (lastAddedIndex !== null && labelRefs.current[lastAddedIndex]) {
      const label = labelRefs.current[lastAddedIndex];
      if (label) {
        label.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(label);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setLastAddedIndex(null);
    }
  }, [lastAddedIndex, newOptions]);

  const handleValueChange = useCallback((value: string) => {
    setSelectedValue(value);
    props.updateAttributes({
      selectedValue: value
    });
  }, [props]);

  const handleLabelChange = useCallback((index: number, newLabel: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = { ...updatedOptions[index], label: newLabel };
    setNewOptions(updatedOptions);
    props.updateAttributes({
      options: updatedOptions
    });
  }, [newOptions, props]);

  const handleOptionClick = useCallback((value: string) => {
    if (!isEditable) {
      handleValueChange(value);
    }
  }, [isEditable, handleValueChange]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLLabelElement>, index: number) => {
    handleKeyDown(
      e,
      {
        mode: 'single',
        index,
        setNewOptions,
        newOptions,
        setSelectedValue,
        selectedValue,
        setLastAddedIndex,
        labelRefs,
        props
      }
    );
  }, [newOptions, props]);

  return (
    <NodeViewWrapper>
      <div className="relative group">
        <RadioGroup 
          className="mt-8" 
          value={selectedValue}
          onValueChange={handleValueChange}
        >
          {newOptions.map((option: Option, index: number) => (
            <div 
              key={option.value} 
              className="flex items-center rounded-md px-2 hover:cursor-pointer hover:bg-accent transitions-all duration-300"
              onClick={() => handleOptionClick(option.value)}
            >
              <RadioGroupItem 
                className="hover:cursor-pointer"
                value={option.value} 
                id={`${nodeId}-r${index}`}
                disabled={isEditable}
              />
              <Label
                ref={(el: HTMLLabelElement | null) => {
                  labelRefs.current[index] = el;
                }}
                className="w-full h-full max-w-2 pl-4 py-3 focus:ring-0 focus:border-0 focus:outline-none hover:cursor-pointer group-data-[disabled=true]:pointer-events-auto group-data-[disabled=true]:opacity-100 peer-disabled:cursor-auto peer-disabled:opacity-100"
                htmlFor={`${nodeId}-r${index}`}
                contentEditable={isEditable}
                onBlur={(e) => handleLabelChange(index, e.currentTarget.textContent || option.label)}
                onKeyDown={(e) => onKeyDown(e, index)}
                suppressContentEditableWarning
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <span className="rounded-md px-2 py-1 text-sm text-success bg-success/15">
          Correct
        </span>
      </div>
    </NodeViewWrapper>
  );
}