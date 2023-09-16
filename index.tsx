import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import QuizCreation from "./src/QuizCreation";
import { Configuration, OpenAIApi } from "openai";


export const QuizComponent = (prompt: string, apiKey: string) => {
  const [instance, setInstance] = useState<OpenAIApi | null>(null);

  const openAiInstance = (api: string) => {
    const configuration = new Configuration({
      apiKey: api,
    });

    configuration.baseOptions.headers = {
      Authorization: "Bearer " + api,
    };
    const openAI = new OpenAIApi(configuration);
    setInstance(openAI);
  }

  useEffect(() => {
    openAiInstance(apiKey)
  }, [])

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <QuizCreation openAi={instance!} topic={prompt}  />
    </QueryClientProvider>
  );
}

export const useDomToggle = (active = false) => {
    const [isActive, setIsActive] = useState(active);
    console.log({active})
    return [isActive, setIsActive]
}
