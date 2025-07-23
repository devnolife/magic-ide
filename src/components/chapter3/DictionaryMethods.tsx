"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Key, Eye, List, Play, Lightbulb } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface DictionaryMethodsProps {
  onComplete: () => void;
}

interface StudentData {
  name: string;
  age: number;
  grade: string;
  subjects: string[];
}

export function DictionaryMethods({ onComplete }: DictionaryMethodsProps) {
  const [currentDemo, setCurrentDemo] = useState<'keys' | 'values' | 'items' | 'complete'>('keys');
  const [studentDict] = useState<Record<string, StudentData>>({
    alice: { name: 'Alice Johnson', age: 20, grade: 'A', subjects: ['Math', 'Science'] },
    bob: { name: 'Bob Smith', age: 19, grade: 'B', subjects: ['English', 'History'] },
    charlie: { name: 'Charlie Brown', age: 21, grade: 'A', subjects: ['Art', 'Music'] }
  });

  const [extractedKeys, setExtractedKeys] = useState<string[]>([]);
  const [extractedValues, setExtractedValues] = useState<StudentData[]>([]);
  const [extractedItems, setExtractedItems] = useState<[string, StudentData][]>([]);
  const [animating, setAnimating] = useState<string | null>(null);
  const [completedMethods, setCompletedMethods] = useState<string[]>([]);

  useEffect(() => {
    if (completedMethods.length >= 3) {
      setCurrentDemo('complete');
      onComplete();
    }
  }, [completedMethods, onComplete]);

  const demonstrateKeys = () => {
    setAnimating('keys');
    setExtractedKeys([]);

    // Animate keys extraction
    const keys = Object.keys(studentDict);
    keys.forEach((key, index) => {
      setTimeout(() => {
        setExtractedKeys(prev => [...prev, key]);
      }, index * 500);
    });

    setTimeout(() => {
      setAnimating(null);
      if (!completedMethods.includes('keys')) {
        setCompletedMethods(prev => [...prev, 'keys']);
      }
    }, keys.length * 500 + 500);
  };

  const demonstrateValues = () => {
    setAnimating('values');
    setExtractedValues([]);

    // Animate values extraction
    const values = Object.values(studentDict);
    values.forEach((value, index) => {
      setTimeout(() => {
        setExtractedValues(prev => [...prev, value]);
      }, index * 600);
    });

    setTimeout(() => {
      setAnimating(null);
      if (!completedMethods.includes('values')) {
        setCompletedMethods(prev => [...prev, 'values']);
      }
    }, values.length * 600 + 500);
  };

  const demonstrateItems = () => {
    setAnimating('items');
    setExtractedItems([]);

    // Animate items extraction
    const items = Object.entries(studentDict);
    items.forEach((item, index) => {
      setTimeout(() => {
        setExtractedItems(prev => [...prev, item]);
      }, index * 700);
    });

    setTimeout(() => {
      setAnimating(null);
      if (!completedMethods.includes('items')) {
        setCompletedMethods(prev => [...prev, 'items']);
      }
    }, items.length * 700 + 500);
  };

  const KeysDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Key className="w-6 h-6 text-blue-500" />
        .keys() - Get All Labels
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Original Dictionary:</h4>
          <div className={styles.visualOutput}>
            <div className={styles.dictionaryVisual}>
              {Object.entries(studentDict).map(([key, student]) => (
                <div key={key} className={styles.keyValuePair}>
                  <div className={styles.key}>{key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>{student.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className={styles.codeExample}>
              <div className="text-gray-400"># Get all keys (labels)</div>
              <div>student_ids = students.keys()</div>
              <div className="text-gray-400"># Result: ['alice', 'bob', 'charlie']</div>
            </div>
          </div>

          <Button
            onClick={demonstrateKeys}
            className="mt-4 w-full"
            disabled={animating === 'keys'}
          >
            <Play className="w-4 h-4 mr-2" />
            {animating === 'keys' ? 'Extracting Keys...' : 'Run .keys() Method'}
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Extracted Keys:</h4>
          <div className={styles.visualOutput}>
            <div className="space-y-2">
              {extractedKeys.map((key, index) => (
                <div
                  key={index}
                  className={`${styles.keyValuePair} ${styles.highlighted} ${index === 0 ? styles.slideInUp :
                      index === 1 ? styles.slideInUpDelay1 :
                        styles.slideInUpDelay2
                    }`}
                >
                  <div className={styles.key}>{key}</div>
                </div>
              ))}
              {extractedKeys.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Click "Run .keys() Method" to see the result
                </div>
              )}
            </div>
          </div>

          {extractedKeys.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Use case:</strong> When you need to know what information is available
                in your dictionary, use .keys() to get all the labels!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ValuesDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Eye className="w-6 h-6 text-green-500" />
        .values() - Get All Information
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Original Dictionary:</h4>
          <div className={styles.visualOutput}>
            <div className={styles.dictionaryVisual}>
              {Object.entries(studentDict).map(([key, student]) => (
                <div key={key} className={styles.keyValuePair}>
                  <div className={styles.key}>{key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>{student.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className={styles.codeExample}>
              <div className="text-gray-400"># Get all values (data)</div>
              <div>student_data = students.values()</div>
              <div className="text-gray-400"># Result: all student information</div>
            </div>
          </div>

          <Button
            onClick={demonstrateValues}
            className="mt-4 w-full"
            disabled={animating === 'values'}
          >
            <Play className="w-4 h-4 mr-2" />
            {animating === 'values' ? 'Extracting Values...' : 'Run .values() Method'}
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Extracted Values:</h4>
          <div className={styles.visualOutput}>
            <div className="space-y-3">
              {extractedValues.map((student, index) => (
                <div
                  key={index}
                  className={`p-3 bg-green-50 border border-green-200 rounded-lg ${index === 0 ? styles.slideInUp :
                      index === 1 ? styles.slideInUpDelay1 :
                        styles.slideInUpDelay2
                    }`}
                >
                  <div className="font-semibold text-green-800">{student.name}</div>
                  <div className="text-sm text-green-600">
                    Age: {student.age}, Grade: {student.grade}
                  </div>
                  <div className="text-xs text-green-500">
                    Subjects: {student.subjects.join(', ')}
                  </div>
                </div>
              ))}
              {extractedValues.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Click "Run .values() Method" to see the result
                </div>
              )}
            </div>
          </div>

          {extractedValues.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Use case:</strong> When you need all the actual data without
                caring about the keys, use .values()!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ItemsDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <List className="w-6 h-6 text-purple-500" />
        .items() - Get Everything Together
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Original Dictionary:</h4>
          <div className={styles.visualOutput}>
            <div className={styles.dictionaryVisual}>
              {Object.entries(studentDict).map(([key, student]) => (
                <div key={key} className={styles.keyValuePair}>
                  <div className={styles.key}>{key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>{student.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className={styles.codeExample}>
              <div className="text-gray-400"># Get key-value pairs</div>
              <div>for key, value in students.items():</div>
              <div className="ml-4">print(f"{'{key}'}: {'{value}'}")</div>
            </div>
          </div>

          <Button
            onClick={demonstrateItems}
            className="mt-4 w-full"
            disabled={animating === 'items'}
          >
            <Play className="w-4 h-4 mr-2" />
            {animating === 'items' ? 'Extracting Items...' : 'Run .items() Method'}
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Extracted Key-Value Pairs:</h4>
          <div className={styles.visualOutput}>
            <div className="space-y-3">
              {extractedItems.map(([key, student], index) => (
                <div
                  key={index}
                  className={`${styles.keyValuePair} ${styles.highlighted} ${index === 0 ? styles.slideInUp :
                      index === 1 ? styles.slideInUpDelay1 :
                        styles.slideInUpDelay2
                    }`}
                >
                  <div className={styles.key}>{key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-xs">Age: {student.age}, Grade: {student.grade}</div>
                  </div>
                </div>
              ))}
              {extractedItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Click "Run .items() Method" to see the result
                </div>
              )}
            </div>
          </div>

          {extractedItems.length > 0 && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Use case:</strong> Perfect for loops! When you need both
                the key and value together, use .items()!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CompletionDemo = () => (
    <div className={styles.conceptDemo}>
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Excellent Work!</h3>
        <p className="text-green-700 mb-6">
          You've mastered the three essential dictionary methods. Now you can:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <Key className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">.keys()</p>
            <p className="text-sm text-gray-600">Get all dictionary labels</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">.values()</p>
            <p className="text-sm text-gray-600">Get all dictionary data</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <List className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="font-semibold">.items()</p>
            <p className="text-sm text-gray-600">Get key-value pairs together</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-800 font-semibold">Pro Tip:</p>
          <p className="text-amber-700 text-sm">
            These methods are most powerful when used in loops to process all dictionary data at once!
          </p>
        </div>

        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          ✅ Dictionary Methods Mastered!
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {['keys', 'values', 'items', 'complete'].map((step, index) => {
          const isActive = currentDemo === step;
          const isCompleted = ['keys', 'values', 'items'].indexOf(currentDemo) > index || currentDemo === 'complete';

          return (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < 3 && (
                <div className={`w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Learning Objectives */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Dictionary Methods You'll Master
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedMethods.includes('keys') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>.keys() - Extract all labels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedMethods.includes('values') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>.values() - Extract all data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedMethods.includes('items') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>.items() - Extract everything</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={() => setCurrentDemo('keys')}
          variant={currentDemo === 'keys' ? 'default' : 'outline'}
          size="sm"
        >
          1. Keys
        </Button>
        <Button
          onClick={() => setCurrentDemo('values')}
          variant={currentDemo === 'values' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedMethods.includes('keys')}
        >
          2. Values
        </Button>
        <Button
          onClick={() => setCurrentDemo('items')}
          variant={currentDemo === 'items' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedMethods.includes('values')}
        >
          3. Items
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.slideInUp}>
        {currentDemo === 'keys' && <KeysDemo />}
        {currentDemo === 'values' && <ValuesDemo />}
        {currentDemo === 'items' && <ItemsDemo />}
        {currentDemo === 'complete' && <CompletionDemo />}
      </div>
    </div>
  );
}
