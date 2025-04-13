// Метод хорд
import { Equation, IntegralSolvingMethod, MethodFunction, ValidationError } from "./types.ts";
import { INITIAL_SEGMENTS, SEGMENTS } from "./constants.ts";

const derivative = (x: number, equation: Equation) => (equation(x + 1e-6) - equation(x)) / 1e-6;

const secondDerivative = (x: number, equation: Equation) =>
  (equation(x + 1e-6) - 2 * equation(x) + equation(x - 1e-6)) / (1e-6 ** 2);

const rectangleLeftMethod = (equation: Equation, a: number, b: number, segmentCount: number) => {
  const segmentLength = (b - a) / segmentCount
  const data = Array.from({ length: segmentCount },
    (_, i) => a + segmentLength * i
  );

  return segmentLength * data.reduce((acc, x) => acc + equation(x), 0)
}

const rectangleRightMethod = (equation: Equation, a: number, b: number, segmentCount: number) => {
  const segmentLength = (b - a) / segmentCount
  const data = Array.from({ length: segmentCount },
    (_, i) => a + (i + 1) * segmentLength
  );

  return segmentLength * data.reduce((acc, x) => acc + equation(x), 0)
}

const rectangleCenterMethod = (equation: Equation, a: number, b: number, segmentCount: number) => {
  const segmentLength = (b - a) / segmentCount
  const data = Array.from({ length: segmentCount },
    (_, i) => a + (i + 0.5) * segmentLength
  );

  return segmentLength * data.reduce((acc, x) => acc + equation(x), 0)
}
const trapezoidMethod = (equation: Equation, a: number, b: number, segmentCount: number) => {
  const segmentLength = (b - a) / segmentCount
  const data = Array.from({ length: segmentCount + 1 },
    (_, i) => a + i * segmentLength
  );

  return segmentLength / 2 * (data[ 0 ] + data[ data.length - 1 ] + 2 * data.slice(1, -1).reduce((acc, x) => acc + equation(x), 0))
}

const simpsonMethod = (equation: Equation, a: number, b: number, segmentCount: number) => {
  const segmentLength = (b - a) / segmentCount
  const data = Array.from({ length: segmentCount + 1 },
    (_, i) => a + i * segmentLength
  );
  let evenSum = 0
  let oddSum = 0
  data.slice(1, -1).forEach((point, index) => {
    if (index % 2 === 0) {
      oddSum += equation(point)
    } else {
      evenSum += equation(point)
    }
  })
  return segmentLength / 3 * (data[ 0 ] + data[ data.length - 1 ] + 4 * oddSum + 2 * evenSum)
}

const methods: Record<IntegralSolvingMethod, MethodFunction> = {
  [ IntegralSolvingMethod.RectangleLeft ]: rectangleLeftMethod,
  [ IntegralSolvingMethod.RectangleRight ]: rectangleRightMethod,
  [ IntegralSolvingMethod.RectangleCenter ]: rectangleCenterMethod,
  [ IntegralSolvingMethod.Trapezoid ]: trapezoidMethod,
  [ IntegralSolvingMethod.Simpson ]: simpsonMethod
};

type SolutionIter = {
  segments: number
  curI: number
  nextI: number
}

export type SolutionData = {
  ans: number
  segments: number
  iters: SolutionIter[]
}

const getDiscontinuityPoints = (equation: Equation, a: number, b: number): number[] => {
  const breakpoints = Array.from<number>({ length: SEGMENTS + 1 })
    .map((_, index) => a + (b - a) * index / SEGMENTS)
    .filter((point) => !isFinite(equation(point)))

  return breakpoints
}

const handleImproperIntegral = (
  method: IntegralSolvingMethod,
  equation: Equation,
  a: number,
  b: number,
  accuracy: number,
  discontinuityPoints: number[]
): SolutionData | ValidationError => {
  console.log(`! Found discontinuity points: function is discontinuous or undefined at ${discontinuityPoints}`);

  const EPS = 0.00001;
  let converges = true;

  for (const bp of discontinuityPoints) {
    const y1 = tryToCompute(equation, bp - EPS);
    const y2 = tryToCompute(equation, bp + EPS);

    if (y1 !== null && y2 !== null && (Math.abs(y1 - y2) > EPS || (y1 === y2 && y1 !== null))) {
      converges = false;
      break;
    }
  }

  if (!converges) {
    console.log('- Integral does not exist: integral does not converge');
    return ValidationError.noConvenge;
  }

  console.log('+ Integral converges');

  let totalIntegral = 0;
  let totalSegments = 0;
  const allIters: SolutionIter[] = [];

  // Handle single discontinuity case
  if (discontinuityPoints.length === 1) {
    let adjustedA = a;
    let adjustedB = b;

    if (Math.abs(discontinuityPoints[ 0 ] - a) < EPS) {
      adjustedA = a + EPS;
    } else if (Math.abs(discontinuityPoints[ 0 ] - b) < EPS) {
      adjustedB = b - EPS;
    }

    const result = computeRegularIntegral(method, equation, adjustedA, adjustedB, accuracy);
    if (checkIfValidationError(result)) return result;

    totalIntegral += result.ans;
    totalSegments += result.segments;
    allIters.push(...result.iters);
  }
  // Handle multiple discontinuities
  else {
    // Sort discontinuities and add endpoints
    const points = [ a, ...discontinuityPoints.sort((x, y) => x - y), b ];

    // Integrate between each pair of adjacent points
    for (let i = 0; i < points.length - 1; i++) {
      const left = points[ i ];
      const right = points[ i + 1 ];

      // Check if endpoints are discontinuities
      const leftAdjusted = discontinuityPoints.includes(left) ? left + EPS : left;
      const rightAdjusted = discontinuityPoints.includes(right) ? right - EPS : right;

      // Only compute if the adjusted interval is valid
      if (leftAdjusted < rightAdjusted) {
        const result = computeRegularIntegral(method, equation, leftAdjusted, rightAdjusted, accuracy);
        if (checkIfValidationError(result)) return result;

        totalIntegral += result.ans;
        totalSegments += result.segments;
        allIters.push(...result.iters);
      }
    }
  }

  return {
    ans: totalIntegral,
    segments: totalSegments,
    iters: allIters
  };
};

// Helper function to safely compute function values
const tryToCompute = (equation: Equation, x: number): number | null => {
  try {
    const result = equation(x);
    return isFinite(result) ? result : null;
  } catch {
    return null;
  }
};

const computeRegularIntegral = (
  method: IntegralSolvingMethod,
  equation: Equation,
  a: number,
  b: number,
  accuracy: number
): SolutionData | ValidationError => {
  const currentMethod = methods[ method ];
  let currentSegments = INITIAL_SEGMENTS;
  const k = method === IntegralSolvingMethod.Simpson ? 4 : 2;
  const iters: SolutionIter[] = [];

  const MAX_ITERS = 20
  let iter = 0

  while (iter++ < MAX_ITERS) {
    const currentValue = currentMethod(equation, a, b, currentSegments);
    const nextValue = currentMethod(equation, a, b, currentSegments * 2);

    iters.push({
      segments: currentSegments,
      curI: currentValue,
      nextI: nextValue
    });

    if (Math.abs(currentValue - nextValue) / (2 ** k - 1) < accuracy) {
      return {
        ans: nextValue,
        segments: currentSegments * 2,
        iters
      };
    }

    currentSegments *= 2;
  }

  return ValidationError.noConvenge
};

export const solveEquation = (method: IntegralSolvingMethod, equation: Equation, a: number, b: number, accuracy: number): SolutionData | ValidationError => {
  const discontinuityPoints = getDiscontinuityPoints(equation, a, b)

  if (discontinuityPoints.length) {
    return handleImproperIntegral(method, equation, a, b, accuracy, discontinuityPoints)
  }

  return computeRegularIntegral(method, equation, a, b, accuracy)
}

export const checkIfValidationError = (s: ValidationError | SolutionData): s is ValidationError => {
  return Object.values(ValidationError).includes(s as ValidationError)
}
