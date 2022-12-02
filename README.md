# fcc-solidity-course

This repos has my notes and projects that I build while going through free code camp solidity course by Partick Collins

[Course Link](https://www.youtube.com/watch?v=gyMwXuJrbJQ)

# Notes

## Lesson 6 - Hardhat Simple Storage

Project setup

```
npm init -y
npm install --save-dev hardhat
npx hardhatgit
```

NAMESPACING

- node modules starting @ are called 'scoped packages' allowing NPM packages to be namespaced. Organisations can use this to differentiate between official and unofficial packages
- namespacing for functions/classes is equivalent to scoping in variable. Think of this as using surnames to differencite two people with same names.

TYPESCRIPT DECLARATION

- files with extention .d.ts are typescript declarations file which contain types infomration but no implementation information. These files do not produce .js files on compilation. These are only used for typechecking.
