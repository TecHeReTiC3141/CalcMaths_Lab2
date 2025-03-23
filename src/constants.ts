import { EquationOption, EquationSolvingMethod, SolvingMethodOption } from "./types.ts";

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

export const SEGMENTS = 250;
