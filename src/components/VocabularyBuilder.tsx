import React from 'react';
import vocabulary from '../lib/srv-vocabulary.json';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const VocabularyBuilder = () => {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">SRV Vocabulary Builder</h2>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(vocabulary).map(([category, data]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-gray-400">{data.description}</p>
              <ul className="list-disc list-inside space-y-1">
                {data.terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default VocabularyBuilder;
