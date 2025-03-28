import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Props = {
    setLeftBorder: Dispatch<SetStateAction<number>>
    setRightBorder: Dispatch<SetStateAction<number>>
    setAccuracy: Dispatch<SetStateAction<number>>
}

export function InputUploader({ setLeftBorder, setRightBorder, setAccuracy }: Props) {
    const [ error, setError ] = useState<string | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        setError(null)
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.trim().split("\n")
            const [leftBorder, rightBorder] = lines[0].split(' ').map((val) => +val);
            if (isNaN(leftBorder) || isNaN(rightBorder)) {
                setError("Borders are not numbers")
                return;
            }
            const eps = +lines[lines.length - 1]
            if (isNaN(eps)) {
                setError("Accuracy is not number")
                return;
            }

            setLeftBorder(leftBorder)
            setRightBorder(rightBorder)
            setAccuracy(eps)
        };
        reader.readAsText(file);
    };

    return (
        <div className="section relative">
            <h3 className="text-lg font-bold">Upload file</h3>
            <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="mt-2 border p-1"
            />
            <p className="font-bold">Input Format</p>
            <pre>a b</pre>
            <pre>eps</pre>
            { error && <p className="text-lg text-red-500 font-bold">Incorrect format: {error}</p>}
        </div>
    )
}