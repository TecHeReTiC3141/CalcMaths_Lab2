type Props = {
    solution: number[] | null
    itersForSolution: number
    deviations: number[] | null,
    hasConvenged: boolean
}

export function Solution({ solution, itersForSolution, deviations, hasConvenged }: Props) {
    if (!solution || !deviations) return null;

    return (
        <div className="flex flex-col gap-y-3 items-start section mt-5">
            {!hasConvenged && <span className="text-lg text-red-500 font-bold">Matrix does not have diagonal dominance so answer can be incorrect</span>}
            <label className="text-lg mr-3">Solution:</label>
            <div className="flex gap-x-3">
                <div className="flex items-center gap-x-1">
                    <span className="text-lg">X = </span>
                    <div className="flex flex-col gap-y-2 border-gray-800 border-l-2 border-r-2 rounded-xl px-2">
                        {solution.map((val, i) => (
                            <span key={i} className="text-lg">{val.toFixed(4)}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-x-1">
                    <span className="text-lg">d = </span>
                    <div className="flex flex-col gap-y-2 border-gray-800 border-l-2 border-r-2 rounded-xl px-2">
                        {deviations.map((val, i) => (
                            <span key={i} className="text-lg">{val.toFixed(4)}</span>
                        ))}
                    </div>
                </div>
            </div>
            <label className="text-lg mt-6 mr-3">Iterations: {itersForSolution}</label>
        </div>
    );
};
