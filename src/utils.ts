// Метод хорд
import {
  Equation,
  EquationSolvingMethod,
  MethodFunction,
  SystemEquationOption,
  ValidationError
} from "./types.ts";
import { SEGMENTS } from "./constants.ts";

const derivative = (x: number, equation: Equation) => (equation(x + 1e-6) - equation(x)) / 1e-6;

const secondDerivative = (x: number, equation: Equation) =>
  (equation(x + 1e-6) - 2 * equation(x) + equation(x - 1e-6)) / (1e-6 ** 2);

type SecantMethodIter = {
  b: number
  fB: number
  xk: number
  fXk: number
  xNext: number
  diff: number
}
const MAX_ITERS = 2000

const chordMethod: MethodFunction<SecantMethodIter> = (equation, a, b, tolerance) => {
  const fA = equation(a);
  const fSecondDerivA = secondDerivative(a, equation);
  const isLeftFixed = fA * fSecondDerivA > 0;

  let x0 = isLeftFixed ? b : a;
  let x1 = Infinity;
  const iters: SecantMethodIter[] = []
  for (let i = 0; i < MAX_ITERS; ++i) {
    x1 = x0 - equation(x0) * ((isLeftFixed ? a : b) - x0) / (equation(isLeftFixed ? a : b) - equation(x0))
    iters.push({
      b,
      fB: equation(b),
      xk: x0,
      fXk: equation(x0),
      xNext: x1,
      diff: Math.abs(x1 - x0)
    })
    if (Math.abs(equation(x0)) <= tolerance) break;
    x0 = x1
  }
  return { iters, ans: x1, a, b, equation };
};

// Метод Ньютона
type NewtonMethodIter = {
  xk: number
  fXk: number
  derivXk: number
  xNext: number
  diff: number
}
const newtonMethod: MethodFunction<NewtonMethodIter> = (equation, a, b, tolerance) => {
  const fA = equation(a);
  const fSecondDerivA = secondDerivative(a, equation);
  const isLeftSuits = fA * fSecondDerivA > 0;

  const x = isLeftSuits ? a : b;

  const calc = (x: number) => {
    let curIter = 0
    const iters: NewtonMethodIter[] = []
    let temp
    while (curIter++ < MAX_ITERS && Math.abs(equation(x)) > tolerance) {
      temp = x - equation(x) / derivative(x, equation)
      iters.push({
        xk: x,
        fXk: equation(x),
        derivXk: derivative(x, equation),
        xNext: temp,
        diff: Math.abs(temp - x),
      })
      x = temp;
    }
    return { iters, ans: x, a, b, equation };
  }

  const firstAns = calc(x)
  if (firstAns.ans >= a && firstAns.ans <= b) {
    return firstAns
  }

  const secondAns = calc(isLeftSuits ? b : a)
  if (secondAns.ans >= a && secondAns.ans <= b) {
    return secondAns
  }

  return calc((a + b) / 2)
};

type IterationMethodIter = {
  xk: number
  xNext: number
  fXk: number
  diff: number
}

const iterationMethod: MethodFunction<IterationMethodIter> = (equation, a, b, tolerance) => {
  const maxDerivative = Math.max(...Array.from({ length: SEGMENTS }, (_, i) =>
    Math.abs(derivative(a + (i / (SEGMENTS - 1)) * (b - a), equation))
  ));

  let curIter = 0;

  const iters: IterationMethodIter[] = []
  let lambda = Math.abs(1 / maxDerivative);

  const isDerivPositive = Array.from({ length: SEGMENTS }, (_, i) =>
    derivative(a + (i / (SEGMENTS - 1)) * (b - a), equation)
  ).every((n) => n > 0)

  if (isDerivPositive) {
    lambda *= -1
  }
  const phi = (x: number) => x + lambda * equation(x);
  let x = a;
  let xPrev = Infinity;
  while (curIter++ < MAX_ITERS && Math.abs(x - xPrev) > tolerance) {
    xPrev = x;
    x = phi(x);
    iters.push({
      xk: xPrev,
      xNext: x,
      fXk: equation(xPrev),
      diff: Math.abs(x - xPrev)
    })
  }
  if (isNaN(x)) return ValidationError.noConvenge
  return { iters, ans: x, a, b, equation };
};

const hasSingleRoot = (equation: Equation, a: number, b: number): boolean => {
  const values = Array.from({ length: SEGMENTS }, (_, i) => equation(a + (i / (SEGMENTS - 1)) * (b - a)));
  const signChanges = values.slice(1).filter((val, i) => val * values[ i ] < 0 || values[i] === 0).length;
  return signChanges === 1;
};

const methods: Record<EquationSolvingMethod, MethodFunction<SecantMethodIter | NewtonMethodIter | IterationMethodIter>> = {
  [ EquationSolvingMethod.Chord ]: chordMethod,
  [ EquationSolvingMethod.Newton ]: newtonMethod,
  [ EquationSolvingMethod.Iteration ]: iterationMethod
};

type NewtonSystemIter = {
  xK: string
  xNext: string
  diff: number
}

export type SystemSolutionFunction = (system: SystemEquationOption, initX: number, initY: number, accuracy: number) => {
  iters: NewtonSystemIter[]
  ans: [number, number]
  equations: SystemEquationOption['equations']
} | ValidationError

export type SolutionData = ReturnType<MethodFunction<SecantMethodIter | NewtonMethodIter | IterationMethodIter> | SystemSolutionFunction>

export const solveEquation = (method: EquationSolvingMethod, equation: Equation, a: number, b: number, accuracy: number): SolutionData => {
  if (!hasSingleRoot(equation, a, b)) {
    return ValidationError.notSingleRoot
  }
  return methods[ method ](equation, a, b, accuracy);
}

export const solveSystem: SystemSolutionFunction = (system: SystemEquationOption, initX: number, initY: number, accuracy: number) => {
  const { phi1, phi2 } = system;
  const iters: NewtonSystemIter[] = [];
  let x = initX;
  let y = initY;
  let xPrev = Infinity;
  let yPrev = Infinity;
  let curIter = 0;
  while (curIter++ < MAX_ITERS && Math.sqrt((x - xPrev) ** 2 + (y - yPrev) ** 2) > accuracy) {
    xPrev = x;
    yPrev = y;
    x = phi1(xPrev, yPrev);
    y = phi2(xPrev, yPrev);
    iters.push({
      xK: `(${xPrev.toFixed(4)}, ${yPrev.toFixed(4)})`,
      xNext: `(${x.toFixed(4)}, ${y.toFixed(4)})`,
      diff: Math.sqrt((x - xPrev) ** 2 + (y - yPrev) ** 2)
    });
  }
  if (isNaN(x) || isNaN(y)) return ValidationError.noConvenge
  return { iters, equations: system.equations, ans: [x, y] };
}

export const checkIfValidationError = (s: ValidationError | SolutionData): s is ValidationError => {
  return Object.values(ValidationError).includes(s as ValidationError)
}
