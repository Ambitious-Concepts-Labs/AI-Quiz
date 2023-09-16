"use client";
import { quizCreationSchema } from "./components/quiz";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/form";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./components/separator";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./components/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/card";
import { strict_output } from "./gpt";
import { OpenAIApi } from "openai";
import MCQ from "./quiz/MCQ";
// import OpenEnded from "./quiz/OpenEnded";
import LoadingQuestions from "./LoadingQuestions";

type Props = {
  topic: string;
  openAi: OpenAIApi;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam, openAi }: Props) => {
  const [questionType, setQuestionType] = React.useState("open_ended");
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quiz, setQuiz] = React.useState<any>([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();
  
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      let questions: any;
      setQuestionType(type)
      try {    
        if (type === "open_ended") {
          // questions = await strict_output(
          //   `You are a helpful AI that is able to generate a pair of question and answers, 
          //   the length of each answer should not be more than 15 words, store all the pairs of 
          //   answers and questions in a JSON array`,
          //   new Array(amount).fill(
          //     `You are to generate a random hard open-ended questions about ${topic}`
          //   ),
          //   {
          //     question: "question",
          //     answer: "answer with max length of 15 words",
          //   }
          // );
        } else if (type === "mcq") {
          questions = await strict_output(
            openAi,
            `You are a helpful AI that is able to generate mcq questions and answers, the length of 
            each answer should not be more than 15 words, store all answers and questions and options 
            in a JSON array`,
            new Array(amount).fill(
              `You are to generate a random hard mcq question about ${topic}`
            ),
            {
              question: "question",
              answer: "answer with max length of 15 words",
              option1: "option1 with max length of 15 words",
              option2: "option2 with max length of 15 words",
              option3: "option3 with max length of 15 words",
            }
          );
        }
       
        if (type === "mcq") {
          type mcqQuestion = {
            question: string;
            answer: string;
            option1: string;
            option2: string;
            option3: string;
          };
          console.log(questions)
          setQuiz(questions)
          const manyData = questions.map((question: mcqQuestion) => {
            // mix up the options lol
            const options = [
              question.option1,
              question.option2,
              question.option3,
              question.answer,
            ].sort(() => Math.random() - 0.5);
            console.log({
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(options),
              // gameId: game.id,
              questionType: "mcq",
            })
            return {
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(options),
              // gameId: game.id,
              questionType: "mcq",
            };
          });
          console.log(quiz, 'quiz')
          setShowLoader(false)
        } else if (type === "open_ended") {
          type openQuestion = {
            question: string;
            answer: string;
          };
          setQuiz(quiz)
          questions.map((question: openQuestion) => {
            console.log({
              question: question.question,
              answer: question.answer,
              // gameId: game.id,
              questionType: "open_ended",
            })
            return {
              question: question.question,
              answer: question.answer,
              // gameId: game.id,
              questionType: "open_ended",
            };
          })
          setShowLoader(false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
    },
  });

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
          if (error) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
        }
      },
      onSuccess: (data) => {
        console.log(data, 'data')
        setFinishedLoading(true);
        setShowQuiz(true);
        setShowLoader(false)
        // setTimeout(() => {
        //   if (form.getValues("type") === "mcq") {
        //     // router.push(`/play/mcq/${gameId}`);
        //   } else if (form.getValues("type") === "open_ended") {
        //     // router.push(`/play/open-ended/${gameId}`);
        //   }
        // }, 2000);
      },
      // onSuccess: ({ gameId }: { gameId: string }) => {
      //   setFinishedLoading(true);
      //   setTimeout(() => {
      //     if (form.getValues("type") === "mcq") {
      //       // router.push(`/play/mcq/${gameId}`);
      //     } else if (form.getValues("type") === "open_ended") {
      //       // router.push(`/play/open-ended/${gameId}`);
      //     }
      //   }, 2000);
      // },
    });
  };
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
    // return <h1>Loading...</h1>;
  }

  console.log(form.getValues())
  console.log(quiz)
  return (
    <>
      {
        !showQuiz && (
           <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
                  <CardDescription>Choose a topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                              <Input 
                              placeholder="Enter a topic" 
                              {...field} 
                              onChange={(e) => {
                                  form.setValue("topic", e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Please provide any topic you would like to be quizzed on
                              here.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="How many questions?"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  form.setValue("amount", parseInt(e.target.value));
                                }}
                                min={1}
                                max={10}
                              />
                            </FormControl>
                            <FormDescription>
                              You can choose how many questions you would like to be
                              quizzed on here.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          variant={
                            form.getValues("type") === "mcq" ? "default" : "secondary"
                          }
                          className="w-1/2 rounded-none rounded-l-lg"
                          onClick={() => {
                            form.setValue("type", "mcq");
                          }}
                          type="button"
                        >
                          <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                          variant={
                            form.getValues("type") === "open_ended"
                              ? "default"
                              : "secondary"
                          }
                          className="w-1/2 rounded-none rounded-r-lg"
                          onClick={() => form.setValue("type", "open_ended")}
                          type="button"
                        >
                          <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                        </Button>
                      </div>
                      <Button disabled={isLoading} type="submit">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
        )   
      }
      {
        quiz && questionType === 'open_ended' ?
        <>
        </>
        // <OpenEnded 
        //   timeStarted={new Date()}
        //   form={form.getValues()}
        //   game={quiz} />
        :
        <MCQ 
          timeStarted={new Date()}
          form={form.getValues()} game={quiz} />
      }
     
    </>
  );
};

export default QuizCreation;
