import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";


const QuestionsList = ({ questions }: any) => {
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>

          {questions[0].questionType === "open_ended" && (
            <TableHead className="w-[10px] text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        <>
          {questions.map((question: any, index: any) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {question.question} <br />
                    <br />
                    <span className="font-semibold">{question.answer}</span>
                  </TableCell>
                  {questions[0].questionType === "open_ended" ? (
                    <TableCell className={`font-semibold`}>
                      {question.userAnswer}
                    </TableCell>
                  ) : (
                    <TableCell
                      className={`${
                        question.isCorrect ? "text-green-600" : "text-red-600"
                      } font-semibold`}
                    >
                      {question.userAnswer}
                    </TableCell>
                  )}

                  {question.percentageCorrect && (
                    <TableCell className="text-right">
                      {question.percentageCorrect}
                    </TableCell>
                  )}
                </TableRow>
              );
            }
          )}
        </>
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
