import { useState, useEffect, useRef, useCallback } from 'react';
import { NodeViewWrapper } from "@tiptap/react";
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from "~/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { handleKeyDown } from '../option/keyHandlers';
import type { NodeViewProps } from "@tiptap/react";
import type { Option } from "../option/types";
import type { KeyboardEvent } from 'react';

export function MultipleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const nodeId = props.node.attrs.id || props.node.attrs._id || uuidv4();
  const [isEditable, setIsEditable] = useState(props.editor.isEditable);
  const [newOptions, setNewOptions] = useState<Option[]>([...options]);
  const [selectedValues, setSelectedValues] = useState<string[]>(props.node.attrs.selectedValues || []);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
  const labelRefs = useRef<(HTMLLabelElement | null)[]>([]);

  useEffect(() => {
    setNewOptions([...options]);
    setSelectedValues(props.node.attrs.selectedValues || []);
  }, [options, props.node.attrs.selectedValues]);

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

  const handleValueChange = useCallback((value: string, checked: boolean) => {
    const newSelectedValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter(v => v !== value);
    
    setSelectedValues(newSelectedValues);
    props.updateAttributes({
      selectedValues: newSelectedValues
    });
  }, [selectedValues, props]);

  const handleLabelChange = useCallback((index: number, newLabel: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = { ...updatedOptions[index], label: newLabel };
    setNewOptions(updatedOptions);
    props.updateAttributes({
      options: updatedOptions
    });
  }, [newOptions, props]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLLabelElement>, index: number) => {
    handleKeyDown(
      e,
      {
        mode: 'multiple',
        index,
        setNewOptions,
        newOptions,
        setSelectedValues,
        selectedValues,
        setLastAddedIndex,
        labelRefs,
        props
      }
    );
  }, [newOptions, selectedValues, props]);

  return (
    <NodeViewWrapper>
      <div className="relative group">
        <div className="mt-8 space-y-2">
          {newOptions.map((option: Option, index: number) => (
            <div key={option.value} className="flex items-center rounded-md px-2 hover:cursor-pointer hover:bg-accent transitions-colors duration-300">
              <Checkbox
                contentEditable={false}
                id={`${nodeId}-c${index}`}
                disabled={isEditable}
                className="hover:cursor-pointer"
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleValueChange(option.value, checked as boolean)}
              />
              <Label
                ref={(el: HTMLLabelElement | null) => {
                  labelRefs.current[index] = el;
                }}
                className="w-full h-full pl-4 py-3 focus:ring-0 focus:border-0 focus:outline-none hover:cursor-pointer group-data-[disabled=true]:pointer-events-auto group-data-[disabled=true]:opacity-100 peer-disabled:cursor-auto peer-disabled:opacity-100"
                htmlFor={`${nodeId}-c${index}`}
                contentEditable={isEditable}
                onBlur={(e) => handleLabelChange(index, e.currentTarget.textContent || option.label)}
                onKeyDown={(e) => onKeyDown(e, index)}
                suppressContentEditableWarning
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