"use client"

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, Heart } from 'lucide-react';

const eligibilityCriteria = [
  { criterion: 'Age', details: 'You must be between 18 and 65 years old.' },
  { criterion: 'Weight', details: 'You must weigh at least 50 kg (110 lbs).' },
  { criterion: 'Health', details: 'You must be in good general health at the time of donation.' },
  { criterion: 'Donation Interval', details: 'You must wait at least 56 days between whole blood donations.' },
  { criterion: 'Travel', details: 'Certain travel destinations may result in a temporary deferral.' },
  { criterion: 'Medication', details: 'Some medications may disqualify you from donating.' },
];

const quizQuestions = [
  { question: "Are you between 18 and 65 years old?", failMessage: "Donors must be between 18 and 65 years old." },
  { question: "Do you weigh at least 50 kg (110 lbs)?", failMessage: "A minimum weight of 50 kg is required for safety." },
  { question: "Are you feeling healthy and well today?", failMessage: "You should only donate when you are in good health." },
  { question: "Was your last blood donation more than 56 days ago?", failMessage: "A 56-day interval is required between donations." },
];

export default function EligibilityPage() {
  const [quizStep, setQuizStep] = useState(-1); // -1: not started, n: question index, -2: result
  const [isEligible, setIsEligible] = useState(true);
  const [resultMessage, setResultMessage] = useState("");

  const handleAnswer = (answer: boolean, failMessage: string) => {
    if (!answer) {
      setIsEligible(false);
      setResultMessage(failMessage);
      setQuizStep(-2); // go to result
      return;
    }
    if (quizStep === quizQuestions.length - 1) {
      setIsEligible(true);
      setResultMessage("Congratulations! You seem to be eligible to donate blood. Please confirm with a medical professional at the donation center.");
      setQuizStep(-2); // go to result
    } else {
      setQuizStep(quizStep + 1);
    }
  };

  const startQuiz = () => {
    setQuizStep(0);
    setIsEligible(true);
    setResultMessage("");
  };

  const resetQuiz = () => {
    setQuizStep(-1);
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-24">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Donation Eligibility</h1>
          <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
            Check if you meet the requirements to become a blood donor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 font-headline">General Requirements</h2>
            <Accordion type="single" collapsible className="w-full">
              {eligibilityCriteria.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.criterion}</AccordionTrigger>
                  <AccordionContent>{item.details}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-headline">Am I Eligible? Quiz</CardTitle>
              <CardDescription>Answer these questions for a preliminary eligibility check.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
              {quizStep === -1 && (
                <div className="text-center">
                  <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
                  <Button onClick={startQuiz} size="lg">Start Quiz</Button>
                </div>
              )}
              {quizStep >= 0 && (
                <div className="text-center w-full">
                  <p className="text-lg font-semibold mb-6">{quizQuestions[quizStep].question}</p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => handleAnswer(true, quizQuestions[quizStep].failMessage)} variant="default" className="w-24">Yes</Button>
                    <Button onClick={() => handleAnswer(false, quizQuestions[quizStep].failMessage)} variant="destructive" className="w-24">No</Button>
                  </div>
                </div>
              )}
              {quizStep === -2 && (
                <div className="text-center">
                  {isEligible ? 
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" /> : 
                    <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                  }
                  <h3 className={`text-xl font-bold ${isEligible ? 'text-green-500' : 'text-destructive'}`}>
                    {isEligible ? 'Likely Eligible!' : 'Likely Not Eligible'}
                  </h3>
                  <p className="text-muted-foreground mt-2 mb-6">{resultMessage}</p>
                  <Button onClick={resetQuiz} variant="outline">Take Quiz Again</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
