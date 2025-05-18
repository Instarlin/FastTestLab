import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef, useCallback } from 'react';
// import { CheckCircle2 } from "lucide-react";
import type { KeyboardEvent } from 'react';
import { TextSelection } from "@tiptap/pm/state";

interface Option {
  value: string;
  label: string;
}

export function SingleOption(props: NodeViewProps) {
  const options = props.node.attrs.options || [];
  const [newOptions, setNewOptions] = useState<Option[]>([...options]);
  const nodeId = props.node.attrs.id || props.node.attrs._id || uuidv4();
  const [isEditable, setIsEditable] = useState(props.editor.isEditable);
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

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLLabelElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // TODO: Make editor and app state sync
      //* For now, editor state is one step behind app state
      // const isLast    = index === newOptions.length - 1
      // const isEmpty   = newOptions[index]?.label === ''
      // if (isLast && isEmpty) {
      //   const updatedOptions = newOptions.slice(0, -1)
      //   setNewOptions(updatedOptions)
      //   labelRefs.current.splice(index, 1)

      //   const pos = (typeof props.getPos === 'function')
      //     ? props.getPos()
      //     : null

      //   if (pos !== null) {
      //     const after = pos + props.node.nodeSize
      //     props.editor
      //       .chain()
      //       .focus()
      //       .updateAttributes( 'singleOptionNode', { options: updatedOptions })
      //       .setTextSelection(after)
      //       .run();
      //   }
        // return;
      // }

      const newOption = { value: uuidv4(), label: '' };
      const updatedOptions = [...newOptions];
      updatedOptions.splice(index + 1, 0, newOption);
      setNewOptions(updatedOptions);
      props.updateAttributes({
        options: updatedOptions
      });
      setLastAddedIndex(index + 1);
    }
    if (e.key === 'Backspace') {
      const text = e.currentTarget.textContent;
      if (text === '') {
        e.preventDefault();
        const updatedOptions = [...newOptions];
        const [removed] = updatedOptions.splice(index, 1);
        let newSelected = selectedValue;
        if (selectedValue.includes(removed.value)) {
          newSelected = selectedValue === removed.value ? '' : selectedValue;
          setSelectedValue(newSelected);
          props.updateAttributes({ selectedValue: newSelected });
        }
        setNewOptions(updatedOptions);
        props.updateAttributes({ options: updatedOptions });
        labelRefs.current.splice(index, 1);
        const focusIndex = index > 0 ? index - 1 : 0;
        setLastAddedIndex(focusIndex);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (index < newOptions.length - 1) {
        labelRefs.current[index + 1]?.focus()
        return;
      }

      const pos = (typeof props.getPos === 'function')
        ? props.getPos()
        : null

      if (pos !== null) {
        const after = pos + props.node.nodeSize
        const { state, dispatch } = props.editor.view
        const tr = state.tr.setSelection(TextSelection.create(state.doc, after))
        dispatch(tr)
        props.editor.view.focus()
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index > 0) {
        labelRefs.current[index - 1]?.focus()
        return;
      }

      const pos = (typeof props.getPos === 'function')
        ? props.getPos()
        : null

      if (pos !== null && pos > 0) {
        const before = pos - 1
        const { state, dispatch } = props.editor.view
        const tr = state.tr.setSelection(TextSelection.create(state.doc, before))
        dispatch(tr)
        props.editor.view.focus()
      }
    }
  }, [newOptions, props]);

  return (
    <NodeViewWrapper>
      <div className="relative group">
        <RadioGroup 
          className="mt-8" 
          value={selectedValue}
          onValueChange={handleValueChange}
          disabled={isEditable}
        >
          {newOptions.map((option: Option, index: number) => (
            <div key={option.value} className="flex items-center rounded-md px-2 hover:bg-accent transitions-colors duration-300">
              <RadioGroupItem 
                className="hover:cursor-pointer" 
                value={option.value} 
                id={`${nodeId}-r${index}`}
              />
              <Label
                ref={(el: HTMLLabelElement | null) => {
                  labelRefs.current[index] = el;
                }}
                className="w-full h-full pl-4 py-3 focus:ring-0 focus:border-0 focus:outline-none hover:cursor-pointer group-data-[disabled=true]:pointer-events-auto group-data-[disabled=true]:opacity-100 peer-disabled:cursor-auto peer-disabled:opacity-100"
                htmlFor={`${nodeId}-r${index}`}
                contentEditable={isEditable}
                onBlur={(e) => handleLabelChange(index, e.currentTarget.textContent || option.label)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                suppressContentEditableWarning
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </NodeViewWrapper>
  );
}