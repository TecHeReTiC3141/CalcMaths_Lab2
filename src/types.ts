export type Equation = (x: number) => number;

export type EquationOption = {
    equation: Equation
    label: string
}

type MethodFunctionAnswer<T> = {
    iters: T[]
    ans: number
    a: number
    b: number
    equation: Equation
}

export type MethodFunction<T extends Record<string, number>> = (
    equation: Equation,
    a: number,
    b: number,
    tolerance: number,
    initial?: number
) => MethodFunctionAnswer<T>;

export enum EquationSolvingMethod {
    Chord = 'chord',
    Newton = 'newton',
    Iteration = 'iteration'
}

export type SolvingMethodOption = {
    label: string
    value: EquationSolvingMethod
}

export enum ValidationError {
    notSingleRoot = 'notSingleRoot'
}