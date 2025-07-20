export interface ListElement {
  value: number;
  index: number;
  id: string;
}

export interface ListOperation {
  type: 'append' | 'remove' | 'pop' | 'insert';
  value?: number;
  index?: number;
}

export interface ListVisualizationState {
  elements: ListElement[];
  operation?: ListOperation;
}

export interface PythonCode {
  code: string;
  isValid: boolean;
  error?: string;
}
