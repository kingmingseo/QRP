export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="text-destructive text-xs leading-none">{message}</p>
}
