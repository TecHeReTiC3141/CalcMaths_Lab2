import { useState } from 'react'
import { CoeffUploader, Equation, Solution, Error } from "./components";
import { predefinedEquations, predefinedMethods } from "./constants.ts";
import { EquationSolvingMethod, ValidationError } from "./types.ts";
import { SolutionData, solveEquation } from "./utils.ts";
import Graph from "./components/Graph.tsx";

export default function App() {
  const [ currentEquation, setCurrenctEquation ] = useState<string>();
  const [ leftBorder, setLeftBorder ] = useState<number>();
  const [ rightBorder, setRightBorder ] = useState<number>();
  const [ accuracy, setAccuracy ] = useState<number>(0.001);
  const [ solutionMethod, setSolutionMethod ] = useState<EquationSolvingMethod>();
  const [ error, setError ] = useState<ValidationError>();
  const [ solution, setSolution ] = useState<SolutionData>();

  const isDataValid = !!(currentEquation && solutionMethod && leftBorder !== undefined && rightBorder !== undefined && accuracy && leftBorder <= rightBorder)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equation Solver</h1>
      <div className="flex gap-x-6">
        <div className="flex flex-col gap-y-3">
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-3 section">
              <h3 className="text-lg mb-1 font-bold">Equation</h3>
              <div className="flex gap-x-3 items-center">
                <select defaultValue={undefined} value={currentEquation}
                        onChange={(event) => setCurrenctEquation(event.target.value)}>
                  <option value={undefined}>Select equation</option>
                  {
                    predefinedEquations.map((equation, i) => (
                      <option key={i} value={equation.label}>{equation.label}</option>
                    ))
                  }
                </select>
                <>
                  for interval (<input type="number" value={leftBorder ?? ""}
                                       onChange={(event) => setLeftBorder(+event.target.value)} className="field"/>;
                  <input type="number" value={rightBorder ?? ""} onChange={(event) => setRightBorder(+event.target.value)}
                         className="field"/>)
                </>
              </div>
              <h3 className="text-lg mb-1 mt-4 font-bold">Solution method</h3>
              <div className="flex gap-x-3 items-center">
                <select defaultValue={undefined} value={solutionMethod}
                        onChange={(event) => setSolutionMethod(event.target.value as EquationSolvingMethod)}>
                  <option value={undefined}>Select solution method</option>
                  {
                    predefinedMethods.map((method, i) => (
                      <option key={i} value={method.value}>{method.label}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-3 items-start">
            <label className="text-lg mt-6 mr-3">Accuracy:</label>
            <input type="number" min={0} className="border rounded-lg w-72 text-right p-0.5
                                                        text-lg border-gray-800 focus:border-blue-700 focus:bg-yellow-200"
                   value={accuracy}
                   onChange={(event) => setAccuracy(+event.target.value)}/>
            <button
              className="btn disabled:bg-gray-100 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-default"
              disabled={!isDataValid}
              onClick={() => {
                if (!currentEquation || !solutionMethod || leftBorder === undefined || rightBorder === undefined || !accuracy || leftBorder > rightBorder) return
                const selectedEquation = predefinedEquations.find(({ label }) => label === currentEquation).equation
                const result = solveEquation(solutionMethod, selectedEquation, leftBorder, rightBorder, accuracy)

                const checkIfValidationError = (s: ValidationError | SolutionData): s is ValidationError => {
                  return Object.values(ValidationError).includes(result as ValidationError)
                }

                if (checkIfValidationError(result)) {
                  setError(result)
                  setSolution(undefined)
                } else {
                  setSolution(result)
                  setError(undefined)
                }
              }}
            >
              Find solution
            </button>
          </div>
        </div>
        {solution && <Graph a={solution.a} b={solution.b} equation={solution.equation} root={solution.ans} />}
      </div>

      {solution && <Solution solution={solution}/>}
      {error && <Error error={error} />}
    </div>
  );
};


