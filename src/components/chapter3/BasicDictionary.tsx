"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Search, BookOpen, Lightbulb, Play } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface BasicDictionaryProps {
  onComplete: () => void;
}

interface DictionaryItem {
  key: string;
  value: string;
  highlighted?: boolean;
}

export function BasicDictionary({ onComplete }: BasicDictionaryProps) {
  const [currentDemo, setCurrentDemo] = useState<'concept' | 'creation' | 'access' | 'complete'>('concept');
  const [dictionaryItems, setDictionaryItems] = useState<DictionaryItem[]>([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [userInput, setUserInput] = useState({ key: '', value: '' });
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Initialize with example data
  useEffect(() => {
    setDictionaryItems([
      { key: 'name', value: 'Alice' },
      { key: 'age', value: '25' },
      { key: 'city', value: 'New York' }
    ]);
  }, []);

  // Check completion
  useEffect(() => {
    if (completedTasks.length >= 3) {
      setCurrentDemo('complete');
      onComplete();
    }
  }, [completedTasks, onComplete]);

  const addItem = () => {
    if (userInput.key && userInput.value) {
      const newItem: DictionaryItem = {
        key: userInput.key,
        value: userInput.value,
        highlighted: true
      };
      
      setDictionaryItems(prev => [...prev, newItem]);
      setUserInput({ key: '', value: '' });
      
      // Remove highlight after animation
      setTimeout(() => {
        setDictionaryItems(prev => 
          prev.map(item => ({ ...item, highlighted: false }))
        );
      }, 2000);

      if (!completedTasks.includes('add_item')) {
        setCompletedTasks(prev => [...prev, 'add_item']);
      }
    }
  };

  const searchItem = () => {
    if (searchKey) {
      const found = dictionaryItems.find(item => item.key === searchKey);
      if (found) {
        setSearchResult(`Found: ${found.value}`);
        // Highlight the found item
        setDictionaryItems(prev =>
          prev.map(item => ({
            ...item,
            highlighted: item.key === searchKey
          }))
        );
      } else {
        setSearchResult('Key not found');
      }

      if (!completedTasks.includes('search_item')) {
        setCompletedTasks(prev => [...prev, 'search_item']);
      }

      // Clear highlights after 3 seconds
      setTimeout(() => {
        setDictionaryItems(prev =>
          prev.map(item => ({ ...item, highlighted: false }))
        );
        setSearchResult(null);
      }, 3000);
    }
  };

  const runCodeDemo = () => {
    if (!completedTasks.includes('understand_concept')) {
      setCompletedTasks(prev => [...prev, 'understand_concept']);
    }
  };

  const ConceptDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-500" />
        What is a Dictionary?
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Think of it like an address book:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
              <span className="font-mono text-blue-600">Alice</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">555-0123</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
              <span className="font-mono text-blue-600">Bob</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">555-0456</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
              <span className="font-mono text-blue-600">Charlie</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">555-0789</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">In Python, it looks like this:</h4>
          <div className={styles.codeExample}>
            <div className="text-gray-400"># Creating a dictionary</div>
            <div>phone_book = {'{'}
              <div className="ml-4">
                <div><span className="text-blue-400">"Alice"</span>: <span className="text-green-400">"555-0123"</span>,</div>
                <div><span className="text-blue-400">"Bob"</span>: <span className="text-green-400">"555-0456"</span>,</div>
                <div><span className="text-blue-400">"Charlie"</span>: <span className="text-green-400">"555-0789"</span></div>
              </div>
            {'}'}</div>
          </div>
          
          <Button onClick={runCodeDemo} className="mt-4 w-full flex items-center gap-2">
            <Play className="w-4 h-4" />
            I understand! Let's continue
          </Button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 mt-1" />
          <div>
            <p className="font-semibold text-blue-900">Key Concept:</p>
            <p className="text-blue-800">
              A dictionary stores data in <strong>key-value pairs</strong>. 
              The key is like a label (name), and the value is the information (phone number).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CreationDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plus className="w-6 h-6 text-green-500" />
        Adding Items to a Dictionary
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Try adding a new item:</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Key (label):</label>
              <input
                type="text"
                value={userInput.key}
                onChange={(e) => setUserInput(prev => ({ ...prev, key: e.target.value }))}
                placeholder="e.g., email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value (information):</label>
              <input
                type="text"
                value={userInput.value}
                onChange={(e) => setUserInput(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., alice@email.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <Button onClick={addItem} className="w-full" disabled={!userInput.key || !userInput.value}>
              <Plus className="w-4 h-4 mr-2" />
              Add to Dictionary
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Code:</strong> student["{userInput.key || 'key'}"] = "{userInput.value || 'value'}"
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Current Dictionary:</h4>
          <div className={styles.visualOutput}>
            <div className={styles.dictionaryVisual}>
              {dictionaryItems.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.keyValuePair} ${item.highlighted ? styles.highlighted : ''}`}
                >
                  <div className={styles.key}>{item.key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AccessDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-6 h-6 text-purple-500" />
        Finding Information
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Search for a value:</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter a key to search:</label>
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="e.g., name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <Button onClick={searchItem} className="w-full" disabled={!searchKey}>
              <Search className="w-4 h-4 mr-2" />
              Search Dictionary
            </Button>
            
            {searchResult && (
              <div className={`p-3 rounded-lg ${
                searchResult.includes('Found') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {searchResult}
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Code:</strong> student["{searchKey || 'key'}"]
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Dictionary Contents:</h4>
          <div className={styles.visualOutput}>
            <div className={styles.dictionaryVisual}>
              {dictionaryItems.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.keyValuePair} ${item.highlighted ? styles.highlighted : ''}`}
                >
                  <div className={styles.key}>{item.key}</div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.value}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CompletionDemo = () => (
    <div className={styles.conceptDemo}>
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Great Job!</h3>
        <p className="text-green-700 mb-6">
          You've learned the basics of Python dictionaries. You now understand:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">What dictionaries are</p>
            <p className="text-sm text-gray-600">Key-value pair storage</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <Plus className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">How to add items</p>
            <p className="text-sm text-gray-600">dict[key] = value</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <Search className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="font-semibold">How to find values</p>
            <p className="text-sm text-gray-600">dict[key]</p>
          </div>
        </div>
        
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          ✅ Basic Dictionary Concepts Mastered!
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {['concept', 'creation', 'access', 'complete'].map((step, index) => {
          const isActive = currentDemo === step;
          const isCompleted = ['concept', 'creation', 'access'].indexOf(currentDemo) > index || currentDemo === 'complete';
          
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
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('understand_concept') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Understand dictionary concept</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('add_item') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Add items to dictionaries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('search_item') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Access dictionary values</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={() => setCurrentDemo('concept')}
          variant={currentDemo === 'concept' ? 'default' : 'outline'}
          size="sm"
        >
          1. Concept
        </Button>
        <Button
          onClick={() => setCurrentDemo('creation')}
          variant={currentDemo === 'creation' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('understand_concept')}
        >
          2. Creation
        </Button>
        <Button
          onClick={() => setCurrentDemo('access')}
          variant={currentDemo === 'access' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('add_item')}
        >
          3. Access
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.slideInUp}>
        {currentDemo === 'concept' && <ConceptDemo />}
        {currentDemo === 'creation' && <CreationDemo />}
        {currentDemo === 'access' && <AccessDemo />}
        {currentDemo === 'complete' && <CompletionDemo />}
      </div>
    </div>
  );
}
