function* resetableGeneratorFunc() {
  let count = 0
  while (true) {
    if (yield count++) {
      count = 0
    }
  }
}

const resetableGenerator = resetableGeneratorFunc()
console.log(resetableGenerator.next())
console.log(resetableGenerator.next())
console.log(resetableGenerator.next())
console.log(resetableGenerator.next())
console.log(resetableGenerator.next(true))
console.log(resetableGenerator.next())
console.log(resetableGenerator.next())
