import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

type Props = {
    index: number
    row: string[]
    setMatrCoeffs: Dispatch<SetStateAction<string[][]>>
}

export function Equation({ row, index, setMatrCoeffs }: Props) {
    return (
        <div className="flex gap-x-3 items-center" key={index}>
            {row.map((coeff, j) => (
                <>
                    <div className="flex items-center gap-x-1">
                        <input
                            key={j}
                            value={coeff}
                            className={clsx("field", isNaN(+row[ j ]) ? "bg-red-300 focus:bg-red-300" : 'focus:bg-yellow-200')}
                            onChange={(e) => setMatrCoeffs((prev) => {
                                const newMatr = [ ...prev ];
                                newMatr[ index ][ j ] = e.target.value;
                                return newMatr;
                            })}
                        />
                        {j < row.length - 1 && <span className="text-lg">x{j + 1}</span>}
                    </div>
                    {j < row.length - 1 &&
                        <span className="text-xl">{j === row.length - 2 ? '=' : '+'}</span>
                    }
                </>
            ))}
        </div>)
}