'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListElement } from '@/types';

interface ListVisualizerProps {
  elements: ListElement[];
  isAnimating: boolean;
}

export function ListVisualizer({ elements, isAnimating }: ListVisualizerProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">List Visualization</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current list: [{elements.map(el => el.value).join(', ')}]
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-6">
          {/* List container */}
          <div className="flex flex-wrap gap-2 min-h-[120px] p-4 border-2 border-dashed border-muted rounded-lg">
            <AnimatePresence mode="popLayout">
              {elements.map((element, idx) => (
                <motion.div
                  key={element.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.3, delay: idx * 0.1 }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                    transition: { duration: 0.2 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Card className="w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground shadow-lg">
                    <span className="text-lg font-bold">{element.value}</span>
                  </Card>
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {element.index}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>

            {elements.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center w-full h-full text-muted-foreground"
              >
                <p className="text-sm">Empty list - Add some elements!</p>
              </motion.div>
            )}
          </div>

          {/* Operation indicator */}
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center"
            >
              <Badge variant="outline" className="animate-pulse">
                Processing operation...
              </Badge>
            </motion.div>
          )}

          {/* List operations legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Supported Operations:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• append(value) - Add to end</div>
              <div>• remove(value) - Remove first occurrence</div>
              <div>• pop() - Remove last element</div>
              <div>• insert(index, value) - Insert at index</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
