import { useMemo, useState } from 'react'
import { Solution, Error, InputUploader, SystemGraph } from "./components";
import { predefinedEquations, predefinedMethods, predefinedSystemEquations } from "./constants.ts";
import { EquationSolvingMethod, ValidationError } from "./types.ts";
import { checkIfValidationError, SolutionData, solveEquation, solveSystem } from "./utils.ts";
import Graph, { EquationGraph } from "./components/Graph.tsx";
import clsx from "clsx";

type Tab = 'equation' | 'system'

export default function App() {
  const [ currentEquation, setCurrenctEquation ] = useState<string>();
  const [ leftBorder, setLeftBorder ] = useState<number>();
  const [ rightBorder, setRightBorder ] = useState<number>();
  const [ accuracy, setAccuracy ] = useState<number>(0.001);
  const [ solutionMethod, setSolutionMethod ] = useState<EquationSolvingMethod>();
  const [ error, setError ] = useState<ValidationError>();
  const [ solution, setSolution ] = useState<SolutionData>();
  const [ currentTab, setCurrentTab ] = useState<Tab>('equation');
  const [ currentSystem, setCurrentSystem ] = useState<string>();
  const [ initX, setInitX ] = useState<number>();
  const [ initY, setInitY ] = useState<number>();

  const isDataValid = useMemo(() => {
    if (currentTab === 'equation') {
      return !!(currentEquation && solutionMethod && leftBorder !== undefined && rightBorder !== undefined && accuracy && leftBorder <= rightBorder)
    }
    return !!(currentSystem && initX !== undefined && initY !== undefined)
  }, [ accuracy, currentEquation, currentSystem, currentTab, initX, initY, leftBorder, rightBorder, solutionMethod ])

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-x-3 items-start">
        <h1 className="text-2xl font-bold mb-4">Equation Solver</h1>
        <div className="flex items-center gap-x-3 pt-2">
          <span className={clsx(currentTab === 'equation' && 'underline')}>Equation</span>
          <button className="relative w-12 h-6 bg-gray-800 rounded-full"
                  onClick={() => setCurrentTab(prev => prev === 'equation' ? 'system' : 'equation')}>
            <span
              className={clsx(currentTab === 'equation' ? 'left-1' : 'left-7', "absolute top-1 h-4 w-4 bg-white rounded-full transition-all ease-linear")}></span>
          </button>
          <span className={clsx(currentTab === 'system' && 'underline')}>System</span>
        </div>
      </div>
      <div className="flex gap-x-6 items-start">
        <div className="flex flex-col gap-y-3">
          {currentTab === 'equation' ? (
            <div className="flex gap-x-3">
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
                                             onChange={(event) => setLeftBorder(+event.target.value)}
                                             className="field"/>;
                        <input type="number" value={rightBorder ?? ""}
                               onChange={(event) => setRightBorder(+event.target.value)}
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
              </div>
              <InputUploader setAccuracy={setAccuracy} setLeftBorder={setLeftBorder} setRightBorder={setRightBorder}/>
            </div>
          ) : (
            <div className="flex flex-col gap-y-3 section">
              <div className="flex justify-between items-center">
                <h3 className="text-lg mb-1 font-bold">System of Equations</h3>
                <p className="text-sm text-gray-600">Newton method</p>
              </div>
              <div className="flex gap-x-3 items-center">
                <select defaultValue={undefined} value={currentSystem}
                        onChange={(event) => setCurrentSystem(event.target.value)}>
                  <option value={undefined}>Select system</option>
                  {
                    predefinedSystemEquations.map((equation, i) => (
                      <option key={i} value={equation.label}>{equation.label}</option>
                    ))
                  }
                </select>
                <div>
                  <label className="mr-3">
                    x0 =
                    <input type="number" value={initX ?? ""}
                           onChange={(event) => setInitX(+event.target.value)} className="field"/>
                  </label>
                  <label>
                    y0 =
                    <input type="number" value={initY ?? ""}
                           onChange={(event) => setInitY(+event.target.value)}
                           className="field"/>
                  </label>
                </div>
              </div>
            </div>
          )
          }
          <div className="flex flex-col gap-y-3 items-start">
            <label className="text-lg mt-2 mr-3">Accuracy:</label>
            <input type="number" min={0} className="border rounded-lg w-72 text-right p-0.5
                                                          text-lg border-gray-800 focus:border-blue-700 focus:bg-yellow-200"
                   value={accuracy}
                   onChange={(event) => setAccuracy(+event.target.value)}/>
            <button
              className="btn disabled:bg-gray-100 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-default"
              disabled={!isDataValid}
              onClick={() => {
                if (!isDataValid) return
                let result;
                if (currentTab === 'equation') {
                  const selectedEquation = predefinedEquations.find(({ label }) => label === currentEquation).equation
                  result = solveEquation(solutionMethod!, selectedEquation, leftBorder!, rightBorder!, accuracy)
                } else {
                  const selectedSystem = predefinedSystemEquations.find(({ label }) => label === currentSystem)
                  result = solveSystem(selectedSystem!, initX!, initY!, accuracy)
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
        {solution && (currentTab === 'equation' ? <EquationGraph {...solution} /> : <SystemGraph {...solution} />)}
      </div>

      {solution && <Solution solution={solution}/>}
      {error && <Error error={error}/>}
    </div>
  );
};


