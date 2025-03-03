import { useState } from 'react'
import { calculateEquationSolution, generateRandomMatrix } from "./utils.ts";
import { CoeffUploader, Equation, Solution } from "./components";

export default function App() {
    const [ matrCoeffs, setMatrCoeffs ] = useState<string[][]>([
        [ '0', '0', '0', '0' ],
        [ '0', '0', '0', '0' ],
        [ '0', '0', '0', '0' ],
    ]);
    const [ accuracy, setAccuracy ] = useState(0.001);
    const [ solution, setSolution ] = useState<number[] | null>(null);
    const [ deviations, setDeviations ] = useState<number[] | null>(null);
    const [ itersForSolution, setItersForSolution ] = useState(-1);
    const [ hasConvenge, setHasConvenge ] = useState(true);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Matrix Equation Solver</h1>
            <div className="flex gap-x-8">
                <div className="flex flex-col gap-y-3 section">
                <h3 className="text-lg mb-3 font-bold">Matrix</h3>

                <div className="flex flex-col gap-y-3 select-none">
                    {
                        matrCoeffs.map((row, i) => (<Equation index={i} row={row} setMatrCoeffs={setMatrCoeffs}/>))
                    }
                </div>
                <div className="flex gap-x-4 pt-6">
                    <button
                        className="btn"
                        onClick={() => {
                            setMatrCoeffs((prev) => {
                                const newMatr = [ ...prev ];
                                const newRow = new Array((newMatr[ 0 ]?.length ?? 0) + 1).fill(0);
                                return [ ...newMatr.map(row => [ ...row, '0' ]), newRow ];
                            });
                        }}
                    >
                        +
                    </button>
                    <button
                        className="btn"
                        disabled={matrCoeffs.length === 0}
                        onClick={() => {
                            setMatrCoeffs((prev) => {
                                const newMatr = prev.slice(0, -1);
                                return newMatr.map(row => row.slice(0, -1));
                            });
                        }}
                    >
                        -
                    </button>
                    <button
                        className="btn"
                        disabled={matrCoeffs.length === 0}
                        onClick={() => generateRandomMatrix(setMatrCoeffs, matrCoeffs.length)}
                    >
                        Get random
                    </button>
                </div>
            </div>
                <CoeffUploader setMatrCoeffs={setMatrCoeffs}  setAccuracy={setAccuracy}/>
            </div>

            <div className="flex flex-col gap-y-3 items-start">
                <label className="text-lg mt-6 mr-3">Accuracy:</label>
                <input type="text" className="border rounded-lg w-72 text-right p-0.5
                                                    text-lg border-gray-800 focus:border-blue-700 focus:bg-yellow-200"
                       value={accuracy}
                       onChange={(event) => setAccuracy(+event.target.value)}/>
                <button
                    className="btn"
                    disabled={matrCoeffs.length === 0}
                    onClick={() => {
                        const [ solution, iters, deviations, hasConvenge ] = calculateEquationSolution(matrCoeffs, accuracy)
                        console.log("SOLUTION", solution, iters, deviations)
                        setSolution(solution);
                        setItersForSolution(iters)
                        setDeviations(deviations)
                        setHasConvenge(hasConvenge)
                    }}
                >
                    Find solution
                </button>
                <Solution solution={solution} itersForSolution={itersForSolution} deviations={deviations} hasConvenged={hasConvenge}/>
            </div>
        </div>

    )
}


