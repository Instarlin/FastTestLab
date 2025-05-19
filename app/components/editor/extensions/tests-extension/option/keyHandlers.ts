import { v4 as uuidv4 } from 'uuid';
import { TextSelection } from '@tiptap/pm/state';
import type { KeyHandlerParams } from "./types";
import type { KeyboardEvent } from "react";

export const handleKeyDown = (
  e: KeyboardEvent<HTMLLabelElement>,
  params: KeyHandlerParams
) => {
  const {
    index,
    setNewOptions,
    newOptions,
    setLastAddedIndex,
    labelRefs,
    props
  } = params;

  const pos = (typeof props.getPos === 'function') ? props.getPos() : null;

  switch (e.key) {
    case 'Enter':
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
      break;
    case 'Backspace':
      const text = e.currentTarget.textContent;
      if (text === '') {
        e.preventDefault();
        const updatedOptions = [...newOptions];
        const [removed] = updatedOptions.splice(index, 1);

        if (params.mode === 'single' && params.selectedValue !== undefined) {
          let newSelected = params.selectedValue;
          if (params.selectedValue.includes(removed.value)) {
            newSelected = params.selectedValue === removed.value ? '' : params.selectedValue;
            params.setSelectedValue(newSelected);
            props.updateAttributes({ selectedValue: newSelected });
          }
        }
        if (params.mode === 'multiple' && params.selectedValues !== undefined) {
          let newSelected = params.selectedValues;
          if (params.selectedValues.includes(removed.value)) {
            newSelected = params.selectedValues.filter(v => v !== removed.value);
            params.setSelectedValues(newSelected);
            props.updateAttributes({ selectedValues: newSelected });
          }
        }

        setNewOptions(updatedOptions);
        props.updateAttributes({ options: updatedOptions });
        labelRefs.current.splice(index, 1);
        const focusIndex = index > 0 ? index - 1 : 0;
        setLastAddedIndex(focusIndex);
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (index < newOptions.length - 1) {
        labelRefs.current[index + 1]?.focus()
        return;
      }

      if (pos !== null) {
        const after = pos + props.node.nodeSize
        const { state, dispatch } = props.editor.view
        const tr = state.tr.setSelection(TextSelection.create(state.doc, after))
        dispatch(tr)
        props.editor.view.focus()
      }
      break;
    case 'ArrowUp':
      e.preventDefault()
      if (index > 0) {
        labelRefs.current[index - 1]?.focus()
        return;
      }

      if (pos !== null && pos > 0) {
        const before = pos - 1
        const { state, dispatch } = props.editor.view
        const tr = state.tr.setSelection(TextSelection.create(state.doc, before))
        dispatch(tr)
        props.editor.view.focus()
      }
      break;
    default:
      break;
  }
}