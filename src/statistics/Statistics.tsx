import { buttonVariants } from "../components/button";
import { LucideLayoutDashboard } from "lucide-react";

import React from "react";
import ResultsCard from "./ResultsCard";
import AccuracyCard from "./AccuracyCard";
import TimeTakenCard from "./TimeTakenCard";
import QuestionsList from "./QuestionsList";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = (props: any) => {
  const {game, timeStarted, timeEnded} = props
  let accuracy: number = 0;

  console.log(game)
  if (game.gameType === "mcq") {
    let totalCorrect = game.reduce((acc: any, question: any) => {
        console.log(acc, question)

      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.length) * 100;
  } else if (game.gameType === "open_ended") {
    let totalPercentage = game.reduce((acc: any, question: any) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(timeEnded ?? 0)}
            timeStarted={new Date(timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={game} />
      </div>
    </>
  );
};

export default Statistics;
