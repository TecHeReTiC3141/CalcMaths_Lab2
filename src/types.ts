export type Equation = (x: number) => number;

export type EquationOption = {
  equation: Equation
  label: string
}

export type MethodFunction = (equation: Equation, a: number, b: number, segmentCount: number) => number;

export enum IntegralSolvingMethod {
  RectangleLeft = 'rectangleLeft',
  RectangleRight = 'rectangleRight',
  RectangleCenter = 'rectangleCenter',
  Trapezoid = 'trapezoid',
  Simpson = 'Simpson'
}

export type SolvingMethodOption = {
  label: string
  value: IntegralSolvingMethod
}

export enum ValidationError {
  noConvenge = 'noConvenge'
}