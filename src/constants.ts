import { EquationOption, EquationSolvingMethod, SolvingMethodOption, SystemEquationOption } from "./types.ts";

export const predefinedEquations: EquationOption[] = [
    {
        equation: (x: number) => x ** 3 - 2 * x - 5,
        label: 'x^3 - 2x - 5'
    },
    {
        equation: (x: number) => x ** 3 - 3 * x ** 2 + 3 * x - 1,
        label: 'x^3 - 3x^2 + 3x - 1'
    },
    {
        equation: (x: number) => x ** 3 - 1.89 * x ** 2 - 2 * x + 1.76,
        label: 'x^3 - 1.89x^2 - 2x + 1.76'
    },
    {
        equation: (x: number) => Math.sin(x) - x / 2,
        label: 'sin(x) - x / 2'
    },
    {
        equation: (x: number) => Math.exp(x) - 2,
        label: 'e^x - 2'
    },
    {
        equation: (x: number) => Math.log(x) + x,
        label: 'ln(x) + x'
    }
]

export const predefinedMethods: SolvingMethodOption[] = [
    {
        label: 'Chord method',
        value: EquationSolvingMethod.Chord
    },
    {
        label: 'Newton method',
        value: EquationSolvingMethod.Newton
    },
    {
        label: 'Simple iteration method',
        value: EquationSolvingMethod.Iteration
    },
]


export const predefinedSystemEquations: SystemEquationOption[] = [
    {
        equations: [
            (x: number, y: number) => x ** 2 + y ** 2 - 1,
            (x: number, y: number) => y - Math.sin(x),
        ],
        label: 'x^2 + y^2 - 1; y - sin(x)',
        phi1: (x: number, y: number) => Math.sqrt(1 - y ** 2),
        phi2: (x: number, y: number) => Math.sin(x)
    },
    {
        equations: [
            (x: number, y: number) => 0.1 * x ** 2 + x + 0.2 * y ** 2 - 0.3,
            (x: number, y: number) => 0.2 * x ** 2 + y + 0.1 * x * y - 0.7
        ],
        label: '0.1x^2 + x + 0.2y^2 - 0.3; 0.2x^2 + y + 0.1xy - 0.7',
        phi1: (x: number, y: number) => 0.3 - 0.1 * x ** 2 - 0.2 * y ** 2,
        phi2: (x: number, y: number) => 0.7 - 0.2 * x ** 2 - 0.1 * x * y
    }
]
export const SEGMENTS = 250;
