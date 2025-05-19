export interface Option {
  value: string;
  label: string;
}

export type SelectionMode = "single" | "multiple";

interface CommonKeyHandlerParams {
  index: number;
  newOptions: Option[];
  setNewOptions: (opts: Option[]) => void;
  setLastAddedIndex: (idx: number | null) => void;
  labelRefs: React.RefObject<(HTMLLabelElement | null)[]>;
  props: any;
}

interface SingleKeyHandlerParams extends CommonKeyHandlerParams {
  mode: "single";
  selectedValue: string;
  setSelectedValue: (val: string) => void;
}

interface MultipleKeyHandlerParams extends CommonKeyHandlerParams {
  mode: "multiple";
  selectedValues: string[];
  setSelectedValues: (vals: string[]) => void;
}

export type KeyHandlerParams = SingleKeyHandlerParams | MultipleKeyHandlerParams;