const hasDiagonalDominance = (A: number[][]): boolean => {
    return A.every((row, i) => {
        const diag = Math.abs(row[ i ]);
        const sum = row.reduce((acc, val) => acc + Math.abs(val), 0);
        return sum - diag <= diag;
    })
}

const enforceDiagonalDominance = (A: number[][], b: number[]): void => {
    const n = A.length;
    for (let i = 0; i < n; ++i) {
        const max = A[ i ].reduce((acc, cur) => Math.max(acc, cur));
        const maxIndex = A[ i ].findIndex((val) => val === max);
        if (maxIndex !== i) {
            [ A[ i ], A[ maxIndex ] ] = [ A[ maxIndex ], A[ i ] ];
            [ b[ i ], b[ maxIndex ] ] = [ b[ maxIndex ], b[ i ] ];
        }
    }
}

const MAX_ITERATIONS = 1000

const shouldStopIteration = (x: number[], xPrev: number[], eps: number): boolean => {
    return x.every((val, i) => Math.abs(val - xPrev[ i ]) < eps);
}

type Result = [number[][], number, number[][]];

const EMPTY_RESULT: Result = [[], 0, []]

const simpleIterationMethod = (A: number[][], b: number[], x0: number[], eps: number): Result => {
    const C = A.map((row, i) => row.map((val, j) => i === j ? 0 : -val / A[ i ][ i ]));
    const d = b.map((val, i) => val / A[ i ][ i ]);
    const x = [...d];
    const xByIter: number[][] = [];
    const deviationsByIter: number[][] = [];

    const n = A.length;
    for (let iter = 0; iter < MAX_ITERATIONS; ++iter) {
        xByIter.push([...x])
        for (let i = 0; i < n; ++i) {
            x[i] = d[i] + C[i].reduce((acc, val, j) => acc + val * xByIter[iter][j], 0);
        }
        deviationsByIter.push(x.map((val, i) => Math.abs(val - xByIter[iter][i])))
        if (shouldStopIteration(x, xByIter[iter], eps)) {
            return [xByIter.map((row) => row.map((val) => +val.toFixed(6))), iter, deviationsByIter.map((row) => row.map((val) => +val.toFixed(6)))];
        }
    }
    return EMPTY_RESULT;
}

const UPPER_LIMIT = 10
const LOWER_LIMIT = -10

const generateRandomMatrix = (setMatrix: (matrix: string[][]) => void, n: number): void => {
    const matrix = Array.from({ length: n }, () =>
        Array.from({ length: n + 1 }, () =>
            parseFloat((Math.random() * (UPPER_LIMIT - LOWER_LIMIT) + LOWER_LIMIT).toFixed(4)).toString()
        )
    );

    setMatrix(matrix);
}

const calculateEquationSolution = (coeffs: string[][], eps: number): Result => {
    const A = coeffs.map(row => row.slice(0, -1).map(val => +val));
    const b = coeffs.map(row => +row[row.length - 1]);
    if (!hasDiagonalDominance(A)) enforceDiagonalDominance(A, b);
    // if (!hasDiagonalDominance(A)) return EMPTY_RESULT;
    return simpleIterationMethod(A, b, new Array(b.length).fill(0), eps);
}

export { calculateEquationSolution, generateRandomMatrix }
