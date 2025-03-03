type Props = {
    solution: number[][] | null
    itersForSolution: number
    deviations: number[][] | null,
}

export function Solution({ solution, itersForSolution, deviations }: Props) {
    if (!solution || !deviations) return null;

    if (!solution.length) {
        return <span className="text-lg text-red-500 font-bold">Matrix does not have diagonal dominance so answer can be incorrect</span>
    }

    return (
        <div className="flex flex-col gap-y-3 items-start section mt-5">
            <label className="text-lg mr-3">Solution:</label>
            <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-800">
                <thead>
                    <tr>
                        <th className="border border-gray-800 px-4 py-2">Iteration</th>
                        {solution[0].map((_, i) => (
                            <th key={i} className="border border-gray-800 px-4 py-2">x{i + 1}</th>
                        ))}
                        {deviations[0] && deviations[0].map((_, i) => (
                            <th key={`d${i + 1}`} className="border border-gray-800 px-4 py-2">d{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {solution.map((_, iterationIndex) => (
                        <tr key={iterationIndex}>
                            <td className="border border-gray-800 px-4 py-2">{iterationIndex + 1}</td>
                            {solution[iterationIndex].map((val, colIndex) => (
                                <td key={`x${colIndex + 1}`} className="border border-gray-800 px-4 py-2">
                                    {val}
                                </td>
                            ))}
                            {deviations[iterationIndex].map((deviationVal, colIndex) => (
                                <td key={`d${colIndex + 1}`} className="border border-gray-800 px-4 py-2">
                                    {deviationVal}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            <label className="text-lg mt-6 mr-3">Iterations: {itersForSolution}</label>
        </div>
    );
};
