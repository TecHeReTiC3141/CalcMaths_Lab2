import { ValidationError } from "../types.ts";

type ErrorProps = {
  error: ValidationError
}

const errorTexts: Record<ValidationError, string> = {
  [ValidationError.notSingleRoot]: "There is not exactly one root in the interval",
  [ValidationError.noConvenge]: "No convenge for this function so answer will be incorrect",
}


export const Error = ({ error }: ErrorProps) => {
  return (
    <p className="text-red-500 font-bold text-lg">{errorTexts[error]}</p>
  )
}