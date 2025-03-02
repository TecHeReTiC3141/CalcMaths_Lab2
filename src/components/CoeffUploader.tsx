import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";

type Props = {
    setMatrCoeffs: Dispatch<SetStateAction<string[][]>>
    setAccuracy: Dispatch<SetStateAction<number>>
}

export function CoeffUploader({ setMatrCoeffs, setAccuracy }: Props) {
    const [ error, setError ] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        setError(null)
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.trim().split("\n")
            const n = +lines[0]
            if (isNaN(n)) {
                setError("Incorrect number of equations")
                return;
            }
            const matrCoeffs = lines.slice(1, n + 1).map(line => line.trim().split(/\s+/));
            const isSquareMatrix = matrCoeffs.length === n && matrCoeffs.every((row) => row.length === n)
            if (!isSquareMatrix) {
                setError("Matrix is not n x n")
                return;
            }
            const b = lines[n + 1].split(' ').map((coeff) => coeff.trim());
            if (b.length !== n) {
                setError("B array is not of length n")
                return;
            }
            b.forEach((coeff, index) => matrCoeffs[index].push(coeff))
            const eps = +lines[lines.length - 1]
            if (isNaN(eps)) {
                setError("Accuracy is not number")
                return;
            }

            setMatrCoeffs(matrCoeffs);
            setAccuracy(eps)
        };
        reader.readAsText(file);
    };

    return (
        <div className={clsx("section relative")}>
            <h3 className="text-lg font-bold">Upload file</h3>
            <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="mt-2 border p-1"
            />
            <p className="font-bold">Input Format</p>
            <pre>n</pre>
            <pre>a11 ... a1n</pre>
            <pre>a21 ... a2n</pre>
            <pre>... ... ...</pre>
            <pre>an1 ... ann</pre>
            <pre>b1 ... bn</pre>
            { error && <p className="text-lg text-red-500 font-bold">Incorrect format: {error}</p>}
        </div>
    )
}