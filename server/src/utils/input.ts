const readline = require('readline').createInterface(
  {
    input: process.stdin,
    output: process.stdout
  }
)

export default async function input(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(prompt, (answer) => {
      resolve(answer)
    })
  })
}