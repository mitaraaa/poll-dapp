# Poll Contract

This is a simple poll contract that allows users to create polls and vote on them.

## Requirements

-   [Node.js](https://nodejs.org/en/)
-   [Hardhat](https://hardhat.org/)
-   [Ethers.js](https://docs.ethers.io/v6/)

## Installation

```bash
yarn install
```

## Testing

```bash
npx hardhat test
```

```
  Poll
    Deployment
      ✔ Should return all options (348ms)
      ✔ Should cast a vote (72ms)
      ✔ Should return the name of the poll
      ✔ Should prevent double voting (131ms)
      ✔ Should prevent voting for non-existing option (48ms)
      ✔ Should prevent voting on closed poll (119ms)
      ✔ Should return total amount of votes (67ms)
      ✔ Should return the winner (100ms)
      ✔ Should return poll status (59ms)
      ✔ Should return owner's address
      ✔ Check if given address already voted (57ms)


  11 passing (1s)

------------|----------|----------|----------|----------|----------------|
File        |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------|----------|----------|----------|----------|----------------|
 contracts\ |      100 |    70.83 |      100 |      100 |                |
  Poll.sol  |      100 |    70.83 |      100 |      100 |                |
------------|----------|----------|----------|----------|----------------|
All files   |      100 |    70.83 |      100 |      100 |                |
------------|----------|----------|----------|----------|----------------|
```
