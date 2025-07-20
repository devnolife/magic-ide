import { ListOperation } from '@/types';

export class PythonListParser {
  private listVariable: string = 'my_list';
  private currentList: number[] = [];

  parseCode(code: string): { operations: ListOperation[], finalList: number[], error?: string } {
    const operations: ListOperation[] = [];
    this.currentList = [];

    try {
      const lines = code.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip comments and empty lines
        if (trimmedLine.startsWith('#') || trimmedLine === '') {
          continue;
        }

        // Parse list initialization
        if (trimmedLine.includes('=') && trimmedLine.includes('[')) {
          const match = trimmedLine.match(/(\w+)\s*=\s*\[(.*?)\]/);
          if (match) {
            this.listVariable = match[1];
            const elements = match[2].split(',').map(s => s.trim()).filter(s => s !== '');
            this.currentList = elements.map(el => {
              const num = parseInt(el);
              if (isNaN(num)) throw new Error(`Invalid number: ${el}`);
              return num;
            });
          }
          continue;
        }

        // Parse operations
        const operation = this.parseOperation(trimmedLine);
        if (operation) {
          operations.push(operation);
          this.applyOperation(operation);
        }
      }

      return { operations, finalList: [...this.currentList] };
    } catch (error) {
      return {
        operations: [],
        finalList: [],
        error: error instanceof Error ? error.message : 'Unknown parsing error'
      };
    }
  }

  private parseOperation(line: string): ListOperation | null {
    const listVar = this.listVariable;

    // Match append operation: my_list.append(5)
    const appendMatch = line.match(new RegExp(`${listVar}\\.append\\s*\\(\\s*(\\d+)\\s*\\)`));
    if (appendMatch) {
      return { type: 'append', value: parseInt(appendMatch[1]) };
    }

    // Match remove operation: my_list.remove(5)
    const removeMatch = line.match(new RegExp(`${listVar}\\.remove\\s*\\(\\s*(\\d+)\\s*\\)`));
    if (removeMatch) {
      return { type: 'remove', value: parseInt(removeMatch[1]) };
    }

    // Match pop operation: my_list.pop() or my_list.pop(index)
    const popMatch = line.match(new RegExp(`${listVar}\\.pop\\s*\\(\\s*(\\d*)\\s*\\)`));
    if (popMatch) {
      const index = popMatch[1] ? parseInt(popMatch[1]) : undefined;
      return { type: 'pop', index };
    }

    // Match insert operation: my_list.insert(0, 5)
    const insertMatch = line.match(new RegExp(`${listVar}\\.insert\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`));
    if (insertMatch) {
      return {
        type: 'insert',
        index: parseInt(insertMatch[1]),
        value: parseInt(insertMatch[2])
      };
    }

    return null;
  }

  private applyOperation(operation: ListOperation): void {
    switch (operation.type) {
      case 'append':
        if (operation.value !== undefined) {
          this.currentList.push(operation.value);
        }
        break;

      case 'remove':
        if (operation.value !== undefined) {
          const index = this.currentList.indexOf(operation.value);
          if (index > -1) {
            this.currentList.splice(index, 1);
          }
        }
        break;

      case 'pop':
        if (operation.index !== undefined) {
          if (operation.index >= 0 && operation.index < this.currentList.length) {
            this.currentList.splice(operation.index, 1);
          }
        } else {
          this.currentList.pop();
        }
        break;

      case 'insert':
        if (operation.index !== undefined && operation.value !== undefined) {
          this.currentList.splice(operation.index, 0, operation.value);
        }
        break;
    }
  }

  getCurrentList(): number[] {
    return [...this.currentList];
  }
}
