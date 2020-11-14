export async function sleep(timeInSeconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeInSeconds * 1000));
}
