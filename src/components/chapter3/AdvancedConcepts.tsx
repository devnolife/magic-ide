"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Filter, BarChart3, Lightbulb, Play, RefreshCw } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface AdvancedConceptsProps {
  onComplete: () => void;
}

interface Product {
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

export function AdvancedConcepts({ onComplete }: AdvancedConceptsProps) {
  const [currentDemo, setCurrentDemo] = useState<'comprehension' | 'analysis' | 'realworld' | 'complete'>('comprehension');
  const [products] = useState<Record<string, Product>>({
    laptop: { name: 'Gaming Laptop', price: 1299, category: 'Electronics', rating: 4.5, inStock: true },
    mouse: { name: 'Wireless Mouse', price: 29, category: 'Electronics', rating: 4.2, inStock: true },
    book: { name: 'Python Guide', price: 39, category: 'Books', rating: 4.8, inStock: false },
    headphones: { name: 'Noise-Canceling Headphones', price: 199, category: 'Electronics', rating: 4.6, inStock: true },
    coffee: { name: 'Premium Coffee', price: 15, category: 'Food', rating: 4.3, inStock: true }
  });

  const [filteredProducts, setFilteredProducts] = useState<Record<string, Product>>({});
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('');

  useEffect(() => {
    if (completedTasks.length >= 3) {
      setCurrentDemo('complete');
      onComplete();
    }
  }, [completedTasks, onComplete]);

  const runComprehension = (filterType: string) => {
    let result: Record<string, Product> = {};

    switch (filterType) {
      case 'expensive':
        result = Object.fromEntries(
          Object.entries(products).filter(([_, product]) => product.price > 100)
        );
        break;
      case 'electronics':
        result = Object.fromEntries(
          Object.entries(products).filter(([_, product]) => product.category === 'Electronics')
        );
        break;
      case 'instock':
        result = Object.fromEntries(
          Object.entries(products).filter(([_, product]) => product.inStock)
        );
        break;
      case 'highrated':
        result = Object.fromEntries(
          Object.entries(products).filter(([_, product]) => product.rating >= 4.5)
        );
        break;
    }

    setFilteredProducts(result);
    setActiveFilter(filterType);

    if (!completedTasks.includes('dictionary_comprehension')) {
      setCompletedTasks(prev => [...prev, 'dictionary_comprehension']);
    }
  };

  const runAnalysis = () => {
    const analysis = {
      totalProducts: Object.keys(products).length,
      categories: [...new Set(Object.values(products).map(p => p.category))],
      averagePrice: Math.round(Object.values(products).reduce((sum, p) => sum + p.price, 0) / Object.keys(products).length),
      averageRating: Number((Object.values(products).reduce((sum, p) => sum + p.rating, 0) / Object.keys(products).length).toFixed(1)),
      inStockCount: Object.values(products).filter(p => p.inStock).length,
      priceRanges: {
        budget: Object.values(products).filter(p => p.price < 50).length,
        mid: Object.values(products).filter(p => p.price >= 50 && p.price < 200).length,
        premium: Object.values(products).filter(p => p.price >= 200).length
      }
    };

    setAnalysisResult(analysis);

    if (!completedTasks.includes('data_analysis')) {
      setCompletedTasks(prev => [...prev, 'data_analysis']);
    }
  };

  const runRealWorld = () => {
    if (!completedTasks.includes('real_world_application')) {
      setCompletedTasks(prev => [...prev, 'real_world_application']);
    }
  };

  const ComprehensionDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Filter className="w-6 h-6 text-blue-500" />
        Dictionary Comprehensions - Smart Filtering
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Filter products with different criteria:</h4>

          <div className="space-y-3">
            <Button
              onClick={() => runComprehension('expensive')}
              className="w-full justify-start"
              variant={activeFilter === 'expensive' ? 'default' : 'outline'}
            >
              <Zap className="w-4 h-4 mr-2" />
              Show Expensive Items (&gt;$100)
            </Button>

            <Button
              onClick={() => runComprehension('electronics')}
              className="w-full justify-start"
              variant={activeFilter === 'electronics' ? 'default' : 'outline'}
            >
              <Filter className="w-4 h-4 mr-2" />
              Show Electronics Only
            </Button>

            <Button
              onClick={() => runComprehension('instock')}
              className="w-full justify-start"
              variant={activeFilter === 'instock' ? 'default' : 'outline'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Show In-Stock Items
            </Button>

            <Button
              onClick={() => runComprehension('highrated')}
              className="w-full justify-start"
              variant={activeFilter === 'highrated' ? 'default' : 'outline'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Show Highly Rated (4.5+)
            </Button>
          </div>

          {activeFilter && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-semibold mb-1">Python Code:</p>
              <div className={styles.codeExample}>
                {activeFilter === 'expensive' && (
                  <div>expensive = {'{k: v for k, v in products.items() if v.price > 100}'}</div>
                )}
                {activeFilter === 'electronics' && (
                  <div>electronics = {'{k: v for k, v in products.items() if v.category == "Electronics"}'}</div>
                )}
                {activeFilter === 'instock' && (
                  <div>in_stock = {'{k: v for k, v in products.items() if v.inStock}'}</div>
                )}
                {activeFilter === 'highrated' && (
                  <div>high_rated = {'{k: v for k, v in products.items() if v.rating >= 4.5}'}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-3">Filtered Results:</h4>
          <div className={styles.visualOutput}>
            {Object.keys(filteredProducts).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(filteredProducts).map(([key, product]) => (
                  <div key={key} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-blue-800">{product.name}</div>
                      <Badge className={`${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Price: <span className="font-medium">${product.price}</span></div>
                      <div>Category: <span className="font-medium">{product.category}</span></div>
                      <div>Rating: <span className="font-medium">{product.rating}⭐</span></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Click a filter button to see results
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Lightbulb className="w-6 h-6 text-amber-500 mb-2" />
        <p className="text-amber-800 font-semibold">Why Dictionary Comprehensions?</p>
        <p className="text-amber-700 text-sm">
          They create new dictionaries efficiently by filtering and transforming data in a single line.
          Perfect for data analysis and creating subsets of your data!
        </p>
      </div>
    </div>
  );

  const AnalysisDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-500" />
        Data Analysis with Dictionaries
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Analyze the product data:</h4>

          <Button onClick={runAnalysis} className="w-full mb-4">
            <Play className="w-4 h-4 mr-2" />
            Run Data Analysis
          </Button>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-semibold mb-1">Analysis Functions:</p>
            <div className={styles.codeExample}>
              <div className="text-gray-400"># Calculate statistics</div>
              <div>total = len(products)</div>
              <div>avg_price = sum(p.price for p in products.values()) / total</div>
              <div>categories = set(p.category for p in products.values())</div>
              <div>in_stock = sum(1 for p in products.values() if p.inStock)</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Analysis Results:</h4>
          <div className={styles.visualOutput}>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">{analysisResult.totalProducts}</div>
                    <div className="text-sm text-blue-600">Total Products</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">{analysisResult.inStockCount}</div>
                    <div className="text-sm text-green-600">In Stock</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">${analysisResult.averagePrice}</div>
                    <div className="text-sm text-purple-600">Avg Price</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-800">{analysisResult.averageRating}⭐</div>
                    <div className="text-sm text-orange-600">Avg Rating</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-2">Categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.categories.map((category: string) => (
                      <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-2">Price Distribution:</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Budget (&lt;$50):</span>
                      <Badge>{analysisResult.priceRanges.budget} items</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-range ($50-$200):</span>
                      <Badge>{analysisResult.priceRanges.mid} items</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium ($200+):</span>
                      <Badge>{analysisResult.priceRanges.premium} items</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Click "Run Data Analysis" to see insights
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const RealWorldDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <RefreshCw className="w-6 h-6 text-purple-500" />
        Real-World Applications
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl mb-3">🌐</div>
            <h4 className="font-semibold text-blue-800 mb-2">Web APIs</h4>
            <p className="text-sm text-blue-700">
              JSON responses from web services are dictionaries. Perfect for handling user data,
              weather info, social media posts, and more.
            </p>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs font-mono">
              user = response.json()
              <br />name = user["profile"]["name"]
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl mb-3">🎮</div>
            <h4 className="font-semibold text-green-800 mb-2">Game Development</h4>
            <p className="text-sm text-green-700">
              Player stats, inventory items, game settings, and save files all use dictionaries
              for flexible data storage.
            </p>
            <div className="mt-3 p-2 bg-green-100 rounded text-xs font-mono">
              player = {'{'}
              <br />&nbsp;&nbsp;"level": 15,
              <br />&nbsp;&nbsp;"items": ["sword", "potion"]
              <br />{'}'}</div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-2xl mb-3">📊</div>
            <h4 className="font-semibold text-purple-800 mb-2">Data Science</h4>
            <p className="text-sm text-purple-700">
              Analyzing datasets, counting frequencies, grouping data, and creating reports
              all rely heavily on dictionary operations.
            </p>
            <div className="mt-3 p-2 bg-purple-100 rounded text-xs font-mono">
              sales = {'{'}"Q1": 1000, "Q2": 1200{'}'}
              <br />growth = sales["Q2"] - sales["Q1"]
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-2xl mb-3">⚙️</div>
            <h4 className="font-semibold text-orange-800 mb-2">Configuration</h4>
            <p className="text-sm text-orange-700">
              App settings, database connections, and user preferences are stored as
              dictionaries for easy access and modification.
            </p>
            <div className="mt-3 p-2 bg-orange-100 rounded text-xs font-mono">
              config = {'{'}
              <br />&nbsp;&nbsp;"debug": True,
              <br />&nbsp;&nbsp;"database_url": "..."
              <br />{'}'}</div>
          </div>

          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div className="text-2xl mb-3">🗄️</div>
            <h4 className="font-semibold text-cyan-800 mb-2">Caching</h4>
            <p className="text-sm text-cyan-700">
              Store frequently accessed data in dictionaries for faster retrieval,
              improving application performance.
            </p>
            <div className="mt-3 p-2 bg-cyan-100 rounded text-xs font-mono">
              cache = {'{}'}
              <br />if key in cache:
              <br />&nbsp;&nbsp;return cache[key]
            </div>
          </div>

          <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <div className="text-2xl mb-3">📝</div>
            <h4 className="font-semibold text-pink-800 mb-2">Content Management</h4>
            <p className="text-sm text-pink-700">
              Blog posts, comments, user profiles, and content metadata are organized
              using nested dictionary structures.
            </p>
            <div className="mt-3 p-2 bg-pink-100 rounded text-xs font-mono">
              post = {'{'}
              <br />&nbsp;&nbsp;"title": "...",
              <br />&nbsp;&nbsp;"author": {'{}'}
              <br />{'}'}</div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={runRealWorld} className="px-8 py-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            I understand these applications!
          </Button>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="text-center mb-4">
            <Lightbulb className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800">Career Impact</h4>
          </div>
          <p className="text-gray-700 text-center">
            Mastering dictionaries opens doors to web development, data analysis, game development,
            API integration, and virtually every area of programming. They're one of the most
            versatile and powerful data structures in Python!
          </p>
        </div>
      </div>
    </div>
  );

  const CompletionDemo = () => (
    <div className={styles.conceptDemo}>
      <div className="text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-green-800 mb-4">Outstanding Achievement!</h3>
        <p className="text-green-700 mb-8 text-lg">
          You've completed the advanced dictionary concepts! You're now equipped with
          professional-level dictionary skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg border-2 border-blue-200">
            <Filter className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="font-bold text-blue-800 mb-2">Smart Filtering</h4>
            <p className="text-sm text-blue-700">
              Dictionary comprehensions for efficient data processing
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border-2 border-green-200">
            <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="font-bold text-green-800 mb-2">Data Analysis</h4>
            <p className="text-sm text-green-700">
              Statistical operations and insights from dictionary data
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border-2 border-purple-200">
            <RefreshCw className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h4 className="font-bold text-purple-800 mb-2">Real Applications</h4>
            <p className="text-sm text-purple-700">
              Understanding how dictionaries power modern software
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h4 className="font-bold text-orange-900 mb-3">🎓 You're Ready For:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="text-orange-800">✅ Web Development</div>
            <div className="text-orange-800">✅ Data Science</div>
            <div className="text-orange-800">✅ API Integration</div>
            <div className="text-orange-800">✅ Game Development</div>
            <div className="text-orange-800">✅ Database Operations</div>
            <div className="text-orange-800">✅ Advanced Python Projects</div>
          </div>
        </div>

        <Badge className="bg-green-100 text-green-800 px-6 py-3 text-lg">
          🏆 Dictionary Expert Certified!
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {['comprehension', 'analysis', 'realworld', 'complete'].map((step, index) => {
          const isActive = currentDemo === step;
          const isCompleted = ['comprehension', 'analysis', 'realworld'].indexOf(currentDemo) > index || currentDemo === 'complete';

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
            Advanced Dictionary Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('dictionary_comprehension') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Dictionary comprehensions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('data_analysis') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Data analysis techniques</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('real_world_application') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Real-world applications</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={() => setCurrentDemo('comprehension')}
          variant={currentDemo === 'comprehension' ? 'default' : 'outline'}
          size="sm"
        >
          1. Filtering
        </Button>
        <Button
          onClick={() => setCurrentDemo('analysis')}
          variant={currentDemo === 'analysis' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('dictionary_comprehension')}
        >
          2. Analysis
        </Button>
        <Button
          onClick={() => setCurrentDemo('realworld')}
          variant={currentDemo === 'realworld' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('data_analysis')}
        >
          3. Applications
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.slideInUp}>
        {currentDemo === 'comprehension' && <ComprehensionDemo />}
        {currentDemo === 'analysis' && <AnalysisDemo />}
        {currentDemo === 'realworld' && <RealWorldDemo />}
        {currentDemo === 'complete' && <CompletionDemo />}
      </div>
    </div>
  );
}
