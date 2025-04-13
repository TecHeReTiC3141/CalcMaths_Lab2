import { EquationOption, IntegralSolvingMethod, SolvingMethodOption } from "./types.ts";

export const predefinedFunctions: EquationOption[] = [
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
    },
    {
        equation: (x: number) => 1 / x,
        label: '1 / x'
    }
]

export const predefinedMethods: SolvingMethodOption[] = [
    {
        label: 'Left rectangles',
        value: IntegralSolvingMethod.RectangleLeft
    },
    {
        label: 'Right rectangles',
        value: IntegralSolvingMethod.RectangleRight
    },
    {
        label: 'Center rectangle',
        value: IntegralSolvingMethod.RectangleCenter
    },    {
        label: 'Trapezoid',
        value: IntegralSolvingMethod.Trapezoid
    },    {
        label: 'Simpson (parabolas)',
        value: IntegralSolvingMethod.Simpson
    },
]

export const INITIAL_SEGMENTS = 4
export const SEGMENTS = 10000
